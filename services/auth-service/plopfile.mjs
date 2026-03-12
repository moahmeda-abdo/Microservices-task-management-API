
import fs from "fs";



export default function (
	/** @type {import('plop').NodePlopAPI} */
	plop
) {
	plop.setGenerator("cm", {
		description: "application Model, Route and controller",
		prompts: [
			{
				type: "input",
				name: "name",
				message: "module name",
			},
			{
				type: "input",
				name: "authRequired",
				message: "Require User To Be Authenticated",
				default: false,
			},
			{
				type: "input",
				name: "userType",
				message: "Require User To Have A Type",
				default: "",
			},
		],
		actions: [
			{
				type: "add",
				path: "src/api/v1/models/{{snakeCase name}}/{{snakeCase name}}.model.ts",
				templateFile: "plop_templates/models/model.template.hbs",
				skipIfExists: true,
			},
			{
				type: "add",
				path: "src/api/v1/models/{{snakeCase name}}/interfaces/{{snakeCase name}}_document.interface.ts",
				templateFile:
					"plop_templates/models/model_db_document_interface.temp.hbs",
				skipIfExists: true,
			},
			{
				type: "add",
				path: "src/api/v1/models/{{snakeCase name}}/interfaces/{{snakeCase name}}_model.interface.ts",
				templateFile: "plop_templates/models/model_db_model_interface.temp.hbs",
				skipIfExists: true,
			},

			{
				type: "add",
				path: "src/api/v1/routes/{{snakeCase name}}s/create_{{snakeCase name}}.route.ts",
				templateFile: "plop_templates/routes/create_route.temp.hbs",
				skipIfExists: true,
			},
			{
				type: "add",
				path: "src/api/v1/routes/{{snakeCase name}}s/update_{{snakeCase name}}.route.ts",
				templateFile: "plop_templates/routes/update_route.temp.hbs",
				skipIfExists: true,
			},
			{
				type: "add",
				path: "src/api/v1/routes/{{snakeCase name}}s/get_{{snakeCase name}}_details.route.ts",
				templateFile: "plop_templates/routes/get_details_route.temp.hbs",
				skipIfExists: true,
			},
			{
				type: "add",
				path: "src/api/v1/routes/{{snakeCase name}}s/get_{{snakeCase name}}s.route.ts",
				templateFile: "plop_templates/routes/get_all_route.temp.hbs",
				skipIfExists: true,
			},
			{
				type: "add",
				path: "src/api/v1/routes/{{snakeCase name}}s/delete_{{snakeCase name}}.route.ts",
				templateFile: "plop_templates/routes/delete_route.temp.hbs",
				skipIfExists: true,
			},
			{
				type: "add",
				path: "src/api/v1/routes/{{snakeCase name}}s/index.ts",
				templateFile: "plop_templates/routes/index.temp.hbs",
				skipIfExists: true,
			},
			{
				type: "add",
				path: "src/api/v1/routes/{{snakeCase name}}s/helpers.ts",
				templateFile: "plop_templates/routes/helpers.temp.hbs",
				skipIfExists: true,
			},
			{
				type: "add",
				path: "src/api/v1/routes/{{snakeCase name}}s/validation/create_{{snakeCase name}}.validation.ts",
				templateFile:
					"plop_templates/route_validation/create_route_validation.temp.hbs",
				skipIfExists: true,
			},
			{
				type: "add",
				path: "src/api/v1/routes/{{snakeCase name}}s/validation/update_{{snakeCase name}}.validation.ts",
				templateFile:
					"plop_templates/route_validation/update_route_validation.temp.hbs",
				skipIfExists: true,
			},
		],
	});

	plop.setGenerator("common", {
		description: "Service Common code.",
		prompts: [],
		actions: [
			{
				type: "add",
				path: "src/api/common/validation/route_params.validation.ts",
				templateFile:
					"plop_templates/route_validation/route_params_validation.temp.hbs",
				skipIfExists: true,
			},
		],
	});

	// plop.setHelper("titleCase", (str: string) => {
	//    return str.replace(/\w\S*/g, function (txt) {
	//      return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase();
	//    });
	// })

	// plop.setHelper("snakeCase", (str: string) => {
	//   return str
	//     .match(
	//       /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g
	//     )!
	//     .map((x) => x.toLowerCase())
	//     .join("_");
	// })

	// plop.setHelper("camelCase", (str: string) => {
	//   return str
	//     .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
	//       return index === 0 ? word.toLowerCase() : word.toUpperCase();
	//     })
	//     .replace(/\s+/g, "");
	// })


	plop.setGenerator("cr", {
		description: "Create a route and optional validation schema",
		prompts: [
			{
				type: "input",
				name: "name",
				message: "Route name (e.g. invite agent to chat):",
				filter: (val) =>
					val
						.trim()
						.toLowerCase()
						.replace(/[^a-z0-9]+/g, "_")
						.replace(/^_+|_+$/g, ""),
				validate: (val) =>
					/^[a-z0-9_]+$/.test(val) || "❌ Invalid name: must contain letters/numbers",
			},
			{
				type: "list",
				name: "httpMethod",
				message: "Select HTTP method:",
				choices: ["get", "post", "put", "patch", "delete"],
				default: "post",
			},
			{
				type: "input",
				name: "basePath",
				message: "Base path to generate files in:",
				default: () => process.cwd().replace(/\\/g, "/"),
				validate: (val) => fs.existsSync(val) || "❌ Path does not exist",
			},
			{
				type: "confirm",
				name: "includeValidation",
				message: "Include validation file?",
				default: true,
			},
			{
				type: "confirm",
				name: "addToIndex",
				message: "Do you want to add this route to index.ts?",
				default: true,
			},
			{
				type: "confirm",
				name: "useSuggestedExportName",
				message: (answers) => {
					const parts = answers.basePath.split("/");
					const folder = parts[parts.length - 1];
					answers.suggestedExportName = `${folder
						.split("_")
						.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
						.join("")}Routes`;
					return `Use this group route name: ${answers.suggestedExportName}?`;
				},
				when: (answers) => answers.addToIndex && !fs.existsSync(`${answers.basePath}/index.ts`),
			},
			{
				type: "input",
				name: "customExportName",
				message: "Enter your custom group export name:",
				when: (answers) => answers.addToIndex && !fs.existsSync(`${answers.basePath}/index.ts`) && !answers.useSuggestedExportName,
				validate: (val) => /^[A-Za-z][A-Za-z0-9_]*$/.test(val) || "❌ Invalid identifier",
			},
			{
				type: "list",
				name: "appendPosition",
				message: "Where to insert the import/use?",
				choices: ["top", "bottom"],
				when: (answers) => answers.addToIndex,
				default: "top",
			},
		],
		actions: (data) => {
			const actions = [];

			// Generate route file
			actions.push({
				type: "add",
				path: "{{basePath}}/{{snakeCase name}}.route.ts",
				templateFile: "plop_templates/routes/route_with_validation.hbs",
				skipIfExists: true,
			});

			// Optional validation file
			if (data.includeValidation) {
				actions.push({
					type: "add",
					path: "{{basePath}}/validations/{{snakeCase name}}.validation.ts",
					templateFile: "plop_templates/route_validation/basic_route_validation.hbs",
					skipIfExists: true,
				});
			}

			const indexFilePath = `${data.basePath}/index.ts`;
			const fileExists = fs.existsSync(indexFilePath);

			if (data.addToIndex) {
				if (!fileExists) {
					data.exportName = data.useSuggestedExportName
						? data.suggestedExportName
						: data.customExportName || data.suggestedExportName;

					actions.push({
						type: "add",
						path: indexFilePath,
						templateFile: "plop_templates/routes/index_base.hbs",
						skipIfExists: false,
					});
				} else {
					const pascal = plop.getHelper("pascalCase")(data.name);
					const snake = plop.getHelper("snakeCase")(data.name);
					const importLine = `import { ${pascal}Route } from "./${snake}.route";`;
					const useLine = `router.use(${pascal}Route);`;

					actions.push({
						type: "modify",
						path: indexFilePath,
						transform: (content) => {
							let lines = content.split("\n");

							if (!lines.some(line => line.includes(importLine))) {
								if (data.appendPosition === "top") {
									lines.unshift(importLine);
								} else {
									const lastImportIndex = lines.map(l => l.startsWith("import")).lastIndexOf(true);
									lines.splice(lastImportIndex + 1, 0, importLine);
								}
							}

							if (!lines.some(line => line.includes(useLine))) {
								const routerLine = lines.findIndex(line => line.includes("const router"));
								const exportLine = lines.findIndex(line => line.includes("export"));

								if (data.appendPosition === "top" && routerLine !== -1) {
									lines.splice(routerLine + 1, 0, useLine);
								} else {
									lines.splice(exportLine, 0, useLine);
								}
							}

							return lines.join("\n");
						}
					});
				}
			}

			return actions;
		},
	});
}
