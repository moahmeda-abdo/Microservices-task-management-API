import { Notification as NotificationInterface , NotificationDocument } from "./../../models/notification/interfaces/notification_document.interface";
import { Object_id } from "@common/types.common";
import { Notification } from "@models/notification/notification.model";
import { NotFoundError } from "@core/errors/not-found.error";
import { UpdateNotificationData } from "@models/notification/interfaces/notification_document.interface";
import { Query, FilterQuery } from "mongoose";

interface HelperOptions<T = NotificationDocument | NotificationDocument[]> {
	throwCustomErrors?: boolean;
  ignoreDeleted?: boolean;
  builder?: (query: Query<T | null, T>) => Query<T | null, T>;
}

const defaultHelperOptions: HelperOptions = {
	throwCustomErrors: true,
  ignoreDeleted: true,
};

export const NotificationHelpers = {
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
		query: FilterQuery<Partial<NotificationInterface & { _id: Object_id | string }>>,
		{ throwCustomErrors, ignoreDeleted, builder }: HelperOptions = defaultHelperOptions
	) {
    const queryCommand = Notification.findOne({is_deleted: false, ...query});
    if (ignoreDeleted) query.is_deleted = false;
		const doc = (await (builder ? builder(queryCommand) : queryCommand)) as NotificationDocument | null;
		if (!doc && throwCustomErrors)
			throw new NotFoundError(`notification Not Found | Query: ${query}`);
		return doc;
	},
	async findByIdAndUpdate(
		id: string | Object_id,
		data: Omit<UpdateNotificationData, "updated_at">,
		{ throwCustomErrors, ignoreDeleted, builder }: HelperOptions = defaultHelperOptions
	) {
		const update = {...data, updated_at: new Date()};
    const query = {_id: id};
    const queryCommand = this.updateOne(query, update, {throwCustomErrors, ignoreDeleted, builder})
		const doc = await queryCommand;
		if (!doc && throwCustomErrors)
			throw new NotFoundError(`notification Not Found | id: ${id}`);
    return doc
	},
	async updateOne(
		query:FilterQuery<Partial<NotificationInterface & { _id: Object_id | string }>>,
		data: Omit<UpdateNotificationData, "updated_at">,
		{ throwCustomErrors, ignoreDeleted, builder }: HelperOptions = defaultHelperOptions
	) {
    if (ignoreDeleted) query.is_deleted = false
		const update = {
			...data,
			updated_at: new Date(),
		};
    const queryCommand = Notification.findOneAndUpdate(query, update, {
			new: true,
		})
		const doc = (await (builder ? builder(queryCommand) : queryCommand)) as NotificationDocument | null;
		if (!doc && throwCustomErrors)
			throw new NotFoundError(`notification Not Found | Query: ${query}`);
		return doc;
	},
}