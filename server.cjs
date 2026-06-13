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
  try {
    return JSON.parse(
      fs.readFileSync(
        DB_PATH,
        "utf8"
      )
    );
  } catch {
    return {
      ideas: [],
      users: [],
    };
  }
}

function writeDB(data) {
  fs.writeFileSync(
    DB_PATH,
    JSON.stringify(
      data,
      null,
      2
    )
  );
}

function sendJSON(
  res,
  status,
  data
) {
  res.writeHead(
    status,
    {
      "Content-Type":
        "application/json",
    }
  );

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
        (
          chunk
        ) => {
          body +=
            chunk;
        }
      );

      req.on(
        "end",
        () => {
          try {
            resolve(
              JSON.parse(
                body ||
                  "{}"
              )
            );
          } catch {
            resolve(
              {}
            );
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
      // CORS
      res.setHeader(
        "Access-Control-Allow-Origin",
        "http://localhost:3000"
      );

      res.setHeader(
        "Access-Control-Allow-Methods",
        "GET,POST,PUT,DELETE,OPTIONS"
      );

      res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type,Authorization"
      );

      res.setHeader(
        "Access-Control-Allow-Credentials",
        "true"
      );

      if (
        req.method ===
        "OPTIONS"
      ) {
        res.writeHead(
          204
        );

        return res.end();
      }

      let url =
        req.url;

      const method =
        req.method;

      if (
        url.startsWith(
          "/api"
        )
      ) {
        url =
          url.replace(
            "/api",
            ""
          );
      }

      console.log(
        `${method} ${url}`
      );

      const db =
        readDB();

      db.ideas =
        Array.isArray(
          db.ideas
        )
          ? db.ideas
          : [];

      db.users =
        Array.isArray(
          db.users
        )
          ? db.users
          : [];

      // GET IDEAS
      if (
        method ===
          "GET" &&
        url.startsWith(
          "/ideas"
        )
      ) {
        const limit =
          Number(
            new URL(
              req.url,
              "http://localhost:8000"
            ).searchParams.get(
              "_limit"
            )
          ) ||
          db.ideas
            .length;

        return sendJSON(
          res,
          200,
          db.ideas.slice(
            0,
            limit
          )
        );
      }

      // CREATE IDEA
      if (
        method ===
          "POST" &&
        url ===
          "/ideas"
      ) {
        const body =
          await parseBody(
            req
          );

        const newIdea =
          {
            id:
              Date.now().toString(),
            ...body,
            createdAt:
              new Date().toISOString(),
          };

        db.ideas.push(
          newIdea
        );

        writeDB(
          db
        );

        console.log(
          "IDEA CREATED"
        );

        return sendJSON(
          res,
          201,
          newIdea
        );
      }
        // LOGIN
if (
  url === "/auth/login" &&
  method === "POST"
) {
  const body =
    await parseBody(req);

  console.log("LOGIN BODY:", body);

  const loginData =
    body.email || body;

  const email =
    String(
      loginData.email || ""
    )
      .trim()
      .toLowerCase();

  const password =
    String(
      loginData.password || ""
    ).trim();

  const user =
    (db.users || []).find(
      (u) =>
        u.email
          .toLowerCase()
          .trim() === email &&
        u.password.trim() ===
          password
    );

  if (!user) {
    return sendJSON(
      res,
      401,
      {
        message:
          "Invalid credentials",
      }
    );
  }

  return sendJSON(
    res,
    200,
    {
      accessToken:
        "fake-token",

      user: {
        id:
          user.id,
        name:
          user.name,
        email:
          user.email,
      },
    }
  );
}
      // REFRESH
      // REFRESH
if (
  url === "/auth/refresh" &&
  method === "POST"
) {
  return sendJSON(
    res,
    200,
    {
      accessToken: "fake-token",

      user: {
        id: "1",
        name: "Abhishek",
        email:
          "abhishekdewangan8910@gmail.com",
      },
    }
  );
} {
        return sendJSON(
          res,
          200,
          {
            accessToken:
              "fake-token",

            user:
              null,
          }
        );
      }

      return sendJSON(
        res,
        404,
        {
          message:
            "Not Found",
        }
      );
    }
  );

server.listen(
  8000,
  () => {
    console.log(
      "Backend running at http://localhost:8000"
    );
  }
);