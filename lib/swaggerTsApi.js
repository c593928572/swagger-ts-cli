import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname } from "path";
import pkg from "swagger-typescript-api";
const { generateApi } = pkg;

export default async function swaggerTsApi({
  url,
  proxy,
  output,
  reserve,
  templatePath,
}) {
  try {
    const __dirname = dirname(fileURLToPath(import.meta.url));

    if (!templatePath) {
      fs.copySync(
        path.resolve(__dirname, "./swaggerTemplate"),
        path.resolve(process.cwd(), "./swaggerTemplate")
      );
    }

    generateApi({
      output: path.resolve(process.cwd(), output),
      url: url,
      httpClientType: false,
      modular: true,
      templates: path.resolve(
        process.cwd(),
        templatePath ?? "./swaggerTemplate"
      ),
      hooks: {
        onCreateRoute: (routeData) => {
          //增加接口请求前缀
          routeData.request.path = `${proxy}${routeData.request.path}`;
        },
        onFormatRouteName: (routeInfo, templateRouteName) => {
          //自定义路由名称
          return templateRouteName.replace(/Using\w*/, "").replace(/[{}]/, "");
        },
      },
    }).finally(() => {
      if (!reserve && !templatePath) {
        fs.remove("swaggerTemplate");
      }
    });
  } catch (e) {
    if (!reserve && !templatePath) {
      fs.remove("swaggerTemplate");
    }
    console.error(e);
  }
}
