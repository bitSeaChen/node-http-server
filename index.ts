import * as http from "http";
import {IncomingMessage, ServerResponse} from "http";
import * as fs from "fs";
import * as path from "path";
import * as url from "url";

const server = http.createServer();

server.on("request", (request: IncomingMessage, response: ServerResponse) => {
    const publicPath = path.resolve(__dirname, "public");
    const {method, headers, url: rawPath} = request;
    const {pathname} = url.parse(rawPath);

    if (method !== "GET") {
        response.statusCode = 405;
        response.end();
        return;
    }

    let fileName = pathname.substr(1);
    if (fileName === "") {
        fileName = "index.html";
    }

    fs.readFile(path.resolve(publicPath, fileName), (error, data) => {
        if (error) {
            if (error.errno === -4058) {
                response.statusCode = 404;
                fs.readFile(path.resolve(publicPath, "404.html"), (error, data) => {
                    response.end(data);
                });
            } else if (error.errno === -4068) {
                response.statusCode = 403;
                response.end("无权限访问");
            } else {
                response.statusCode = 500;
                response.end("服务器繁忙，请稍后重试！");
            }
        } else {
            response.end(data);
        }
    });
});

server.listen(8888);

