import { Task as TaskInterface , TaskDocument } from "./../../models/task/interfaces/task_document.interface";
import { Object_id } from "@common/types.common";
import { Task } from "@models/task/task.model";
import { NotFoundError } from "@core/errors/not-found.error";
import { UpdateTaskData } from "@models/task/interfaces/task_document.interface";
import { Query, FilterQuery } from "mongoose";

interface HelperOptions<T = TaskDocument | TaskDocument[]> {
	throwCustomErrors?: boolean;
  ignoreDeleted?: boolean;
  builder?: (query: Query<T | null, T>) => Query<T | null, T>;
}

const defaultHelperOptions: HelperOptions = {
	throwCustomErrors: true,
  ignoreDeleted: true,
};

export const TaskHelpers = {
  async findById(
		id: string | Object_id,
		{ throwCustomErrors, ignoreDeleted, builder }: HelperOptions = defaultHelperOptions
	) {
    const query = {_id: id};
    const queryCommand = this.findOne(query, {throwCustomErrors, ignoreDeleted, builder});
		const doc = await queryCommand;
		return doc;
	},
	async findOne(
		query: FilterQuery<Partial<TaskInterface & { _id: Object_id | string }>>,
		{ throwCustomErrors, ignoreDeleted, builder }: HelperOptions = defaultHelperOptions
	) {
    const queryCommand = Task.findOne({is_deleted: false, ...query});
    if (ignoreDeleted) query.is_deleted = false;
		const doc = (await (builder ? builder(queryCommand) : queryCommand)) as TaskDocument | null;
		if (!doc && throwCustomErrors)
			throw new NotFoundError(`task Not Found | Query: ${query}`);
		return doc;
	},
	async findByIdAndUpdate(
		id: string | Object_id,
		data: Omit<UpdateTaskData, "updated_at">,
		{ throwCustomErrors, ignoreDeleted, builder }: HelperOptions = defaultHelperOptions
	) {
		const update = {...data, updated_at: new Date()};
    const query = {_id: id};
    const queryCommand = this.updateOne(query, update, {throwCustomErrors, ignoreDeleted, builder})
		const doc = await queryCommand;
		if (!doc && throwCustomErrors)
			throw new NotFoundError(`task Not Found | id: ${id}`);
    return doc
	},
	async updateOne(
		query:FilterQuery<Partial<TaskInterface & { _id: Object_id | string }>>,
		data: Omit<UpdateTaskData, "updated_at">,
		{ throwCustomErrors, ignoreDeleted, builder }: HelperOptions = defaultHelperOptions
	) {
    if (ignoreDeleted) query.is_deleted = false
		const update = {
			...data,
			updated_at: new Date(),
		};
    const queryCommand = Task.findOneAndUpdate(query, update, {
			new: true,
		})
		const doc = (await (builder ? builder(queryCommand) : queryCommand)) as TaskDocument | null;
		if (!doc && throwCustomErrors)
			throw new NotFoundError(`task Not Found | Query: ${query}`);
		return doc;
	},
}