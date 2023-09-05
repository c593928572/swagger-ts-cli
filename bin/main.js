#! /usr/bin/env node
import { Command } from "commander";
import swaggerTsApi from "../lib/swaggerTsApi.js";

const program = new Command();

program
  .description("通过 swagger-typescript-api 生成 api")
  .requiredOption("-u, --url <http>", "获取 swagger.json 的 url")
  .option("-p, --proxy <string>", "proxy 前缀", "/api")
  .option("-o, --output <string>", "api 生成路径", "./src/services")
  .option("-r, --reserve <boolean>", "swagger 自动生成的模板是否保留", false)
  .option("-t, --templatePath  <string>", "使用指定的 swagger 模板路径")
  .action(({ url, proxy, output, reserve, templatePath }) => {
    swaggerTsApi({ url, proxy, output, reserve, templatePath });
  });

program.parse();
