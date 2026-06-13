const http = require("http");
const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(
  __dirname,
  "src",
  "data",
  "db.json"
);

function readDB() {
  return JSON.parse(
    fs.readFileSync(
      DB_PATH,
      "utf8"
    )
  );
}

function sendJSON(
  res,
  status,
  data
) {
  res.writeHead(status, {
    "Content-Type":
      "application/json",

    "Access-Control-Allow-Origin":
      "*",

    "Access-Control-Allow-Credentials":
      "true",

    "Access-Control-Allow-Headers":
      "Content-Type, Authorization",

    "Access-Control-Allow-Methods":
      "GET, POST, PUT, DELETE, OPTIONS",
  });

  res.end(
    JSON.stringify(data)
  );
}

function parseBody(req) {
  return new Promise(
    (resolve) => {
      let body = "";

      req.on(
        "data",
        (chunk) =>
          (body += chunk)
      );

      req.on(
        "end",
        () => {
          try {
            resolve(
              JSON.parse(
                body || "{}"
              )
            );
          } catch {
            resolve({});
          }
        }
      );
    }
  );
}

const server =
  http.createServer(
    async (
      req,
      res
    ) => {
      if (
        req.method ===
        "OPTIONS"
      ) {
        return sendJSON(
          res,
          200,
          {}
        );
      }

      const {
        method,
        url,
      } = req;

      if (
        url.startsWith(
          "/api/ideas"
        ) &&
        method ===
          "GET"
      ) {
        const db =
          readDB();

        return sendJSON(
          res,
          200,
          db.ideas ||
            []
        );
      }

      if (
        url ===
          "/api/auth/login" &&
        method ===
          "POST"
      ) {
        const body =
          await parseBody(
            req
          );

        const {
          email,
          password,
        } = body;

        const db =
          readDB();

        const user =
          (
            db.users ||
            []
          ).find(
            (u) =>
              u.email ===
                email &&
              u.password ===
                password
          );

        if (
          user
        ) {
          return sendJSON(
            res,
            200,
            {
              accessToken:
                "fake-token",

              user: {
                id: user.id,
                name:
                  user.name,
                email:
                  user.email,
              },
            }
          );
        }

        return sendJSON(
          res,
          401,
          {
            message:
              "Invalid credentials",
          }
        );
      }

      sendJSON(
        res,
        404,
        {
          message:
            "Not found",
        }
      );
    }
  );

const PORT =
  process.env
    .PORT || 3000;

server.listen(
  PORT,
  () =>
    console.log(
      `Running on ${PORT}`
    )
);