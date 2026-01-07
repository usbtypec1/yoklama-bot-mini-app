import axios, { AxiosInstance } from "axios";
import { CookieJar } from "tough-cookie";
import { wrapper } from "axios-cookiejar-support";
import * as cheerio from "cheerio";

export class ObisClientNotLoggedInError extends Error {
  constructor() {
    super("OBIS client is not logged in");
  }
}

export class ObisClient {
  private readonly http: AxiosInstance;

  constructor(
    private readonly studentNumber: string,
    private readonly password: string,
  ) {
    const jar = new CookieJar();

    this.http = wrapper(
      axios.create({
        baseURL: "https://obistest.manas.edu.kg",
        jar,
        withCredentials: true,
      }),
    );
  }

  async login(): Promise<string> {
    // 1️⃣ GET login page (cookies + CSRF)
    const loginPage = await this.http.get<string>("/site/login");
    let $ = cheerio.load(loginPage.data);

    const csrfToken = $('input[name="_csrf"]').attr("value");
    if (!csrfToken) {
      throw new Error("CSRF token not found");
    }

    // 2️⃣ POST login (cookies auto-attached)
    const response = await this.http.post<string>(
      "/site/login",
      new URLSearchParams({
        _csrf: csrfToken,
        "LoginForm[username]": this.studentNumber,
        "LoginForm[password_hash]": this.password,
      }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );
    // console.log(response.data);
    if (response.data.includes("/site/login")) {
      throw new ObisClientNotLoggedInError();
    }
    $ = cheerio.load(response.data);
    return $(".user-header").children("p").text().trim().split("2")[0].trim();
  }
}
