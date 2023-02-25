import type { SendVerificationRequestParams } from "next-auth/providers";
import { createTransport } from "nodemailer";

export default async function sendVerificationRequest(
  params: SendVerificationRequestParams,
) {
  const { identifier, url, provider } = params;
  const { host } = new URL(url);
  // NOTE: You are not required to use `nodemailer`, use whatever you want.
  const transport = createTransport(provider.server as string);
  const result = await transport.sendMail({
    to: identifier,
    from: provider.from,
    subject: `Sign in to ${host}`,
    text: text({ url, host }),
    html: html({ url, host, email: identifier }),
  });
  const failed = result.rejected.concat(result.pending).filter(Boolean);
  if (failed.length) {
    throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`);
  }
}

/**
 * Email HTML body
 * Insert invisible space into domains from being turned into a hyperlink by email
 * clients like Outlook and Apple mail, as this is confusing because it seems
 * like they are supposed to click on it to sign in.
 *
 * @note We don't add the email address to avoid needing to escape it, if you do, remember to sanitize it!
 */
function html(params: { url: string; host: string; email: string }) {
  const { url, host, email } = params;

  const escapedHost = host.replace(/\./g, "&#8203;.");

  const color = {
    text: "#000000",
    buttonBackground: "#000000",
    buttonText: "#ffffff",
    border: "#eaeaea",
  };

  return `
<!DOCTYPE html>
<html
  xmlns="http://www.w3.org/1999/xhtml"
  xmlns:v="urn:schemas-microsoft-com:vml"
  xmlns:o="urn:schemas-microsoft-com:office:office"
>
  <head>
    <title> </title>
    <!--[if !mso]><!-->
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <!--<![endif]-->
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style type="text/css">
      #outlook a {
        padding: 0;
      }

      body {
        margin: 0;
        padding: 0;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
      }

      table,
      td {
        border-collapse: collapse;
      }

      img {
        border: 0;
        height: auto;
        line-height: 100%;
        outline: none;
        text-decoration: none;
        -ms-interpolation-mode: bicubic;
      }

      p {
        display: block;
        margin: 13px 0;
      }
    </style>
    <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings>
            <o:AllowPNG />
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
    <![endif]-->
    <!--[if lte mso 11]>
      <style type="text/css">
        .mj-outlook-group-fix {
          width: 100% !important;
        }
      </style>
    <![endif]-->
    <!--[if !mso]><!-->
    <link
      href="https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700"
      rel="stylesheet"
      type="text/css"
    />
    <style type="text/css">
      @import url(https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700);
    </style>
    <!--<![endif]-->
    <style type="text/css">
      @media only screen and (min-width: 480px) {
        .mj-column-per-100 {
          width: 100% !important;
          max-width: 100%;
        }
      }
    </style>
    <style media="screen and (min-width:480px)">
      .moz-text-html .mj-column-per-100 {
        width: 100% !important;
        max-width: 100%;
      }
    </style>
    <style type="text/css">
      @media only screen and (max-width: 480px) {
        table.mj-full-width-mobile {
          width: 100% !important;
        }

        td.mj-full-width-mobile {
          width: auto !important;
        }
      }
    </style>
    <style type="text/css">
      .container {
        border: 1px solid ${color.border};
        border-radius: 10px;
        margin: 40px auto;
        padding: 20px;
        max-width: 465px;
      }
    </style>
  </head>

  <body style="word-spacing: normal">
    <div class="container">
      <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
      <div style="margin: 0px auto; max-width: 600px">
        <table
          align="center"
          border="0"
          cellpadding="0"
          cellspacing="0"
          role="presentation"
          style="width: 100%"
        >
          <tbody>
            <tr>
              <td
                style="
                  direction: ltr;
                  font-size: 0px;
                  padding: 20px 0;
                  text-align: center;
                "
              >
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" width="600px" ><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
                <div style="margin: 0px auto; max-width: 600px">
                  <table
                    align="center"
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    role="presentation"
                    style="width: 100%"
                  >
                    <tbody>
                      <tr>
                        <td
                          style="
                            direction: ltr;
                            font-size: 0px;
                            padding: 20px 0;
                            text-align: center;
                          "
                        >
                          <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
                          <div
                            class="mj-column-per-100 mj-outlook-group-fix"
                            style="
                              font-size: 0px;
                              text-align: left;
                              direction: ltr;
                              display: inline-block;
                              vertical-align: top;
                              width: 100%;
                            "
                          >
                            <table
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              role="presentation"
                              style="vertical-align: top"
                              width="100%"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    align="center"
                                    style="
                                      font-size: 0px;
                                      padding: 10px 25px;
                                      word-break: break-word;
                                    "
                                  >
                                    <table
                                      border="0"
                                      cellpadding="0"
                                      cellspacing="0"
                                      role="presentation"
                                      style="
                                        border-collapse: collapse;
                                        border-spacing: 0px;
                                      "
                                    >
                                      <tbody>
                                        <tr>
                                          <td style="width: 40px">
                                            <img
                                              alt="Cocktail"
                                              height="37"
                                              src="https://mix.withfilip.com/cocktail.svg"
                                              style="
                                                border: 0;
                                                display: block;
                                                outline: none;
                                                text-decoration: none;
                                                height: 37px;
                                                width: 100%;
                                                font-size: 13px;
                                              "
                                              width="40"
                                            />
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <!--[if mso | IE]></td></tr></table><![endif]-->
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!--[if mso | IE]></td></tr></table></td></tr><tr><td class="" width="600px" ><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
                <div style="margin: 0px auto; max-width: 600px">
                  <table
                    align="center"
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    role="presentation"
                    style="width: 100%"
                  >
                    <tbody>
                      <tr>
                        <td
                          style="
                            direction: ltr;
                            font-size: 0px;
                            padding: 20px 0;
                            text-align: center;
                          "
                        >
                          <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
                          <div
                            class="mj-column-per-100 mj-outlook-group-fix"
                            style="
                              font-size: 0px;
                              text-align: left;
                              direction: ltr;
                              display: inline-block;
                              vertical-align: top;
                              width: 100%;
                            "
                          >
                            <table
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              role="presentation"
                              style="vertical-align: top"
                              width="100%"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    align="center"
                                    style="
                                      font-size: 0px;
                                      padding: 30px 0;
                                      word-break: break-word;
                                    "
                                  >
                                    <div
                                      style="
                                        font-family: Ubuntu, Helvetica, Arial,
                                          sans-serif;
                                        font-size: 24px;
                                        font-weight: normal;
                                        line-height: 1;
                                        text-align: center;
                                        color: ${color.text};
                                      "
                                    >
                                      Click on the button below to sign in to
                                      <strong>${escapedHost}</strong>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    align="center"
                                    vertical-align="middle"
                                    style="
                                      font-size: 0px;
                                      padding: 10px 25px;
                                      padding-right: 20px;
                                      padding-left: 20px;
                                      word-break: break-word;
                                    "
                                  >
                                    <table
                                      border="0"
                                      cellpadding="0"
                                      cellspacing="0"
                                      role="presentation"
                                      style="
                                        border-collapse: separate;
                                        line-height: 100%;
                                      "
                                    >
                                      <tr>
                                        <td
                                          align="center"
                                          bgcolor="${color.buttonBackground}"
                                          role="presentation"
                                          style="
                                            border: none;
                                            border-radius: 5px;
                                            cursor: auto;
                                            background: ${color.buttonBackground};
                                          "
                                          valign="middle"
                                        >
                                          <a
                                            href="${url}"
                                            style="
                                              display: inline-block;
                                              background: ${color.buttonBackground};
                                              color: ${color.buttonText};
                                              font-family: Ubuntu, Helvetica,
                                                Arial, sans-serif;
                                              font-size: 12px;
                                              font-weight: 500;
                                              line-height: 120%;
                                              margin: 0;
                                              text-decoration: none;
                                              text-transform: none;
                                              padding: 10px 25px;
                                              border-radius: 5px;
                                            "
                                            target="_blank"
                                          >
                                            Sign in
                                          </a>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <!--[if mso | IE]></td></tr></table><![endif]-->
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!--[if mso | IE]></td></tr></table></td></tr><tr><td class="" width="600px" ><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
                <div style="margin: 0px auto; max-width: 600px">
                  <table
                    align="center"
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    role="presentation"
                    style="width: 100%"
                  >
                    <tbody>
                      <tr>
                        <td
                          style="
                            direction: ltr;
                            font-size: 0px;
                            padding: 20px 0;
                            text-align: center;
                          "
                        >
                          <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
                          <div
                            class="mj-column-per-100 mj-outlook-group-fix"
                            style="
                              font-size: 0px;
                              text-align: left;
                              direction: ltr;
                              display: inline-block;
                              vertical-align: top;
                              width: 100%;
                            "
                          >
                            <table
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              role="presentation"
                              style="vertical-align: top"
                              width="100%"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    align="center"
                                    style="
                                      font-size: 0px;
                                      padding: 10px 0;
                                      word-break: break-word;
                                    "
                                  >
                                    <div
                                      style="
                                        font-family: Ubuntu, Helvetica, Arial,
                                          sans-serif;
                                        font-size: 18px;
                                        line-height: 1;
                                        text-align: center;
                                        color: ${color.text};
                                      "
                                    >
                                      or copy and paste this URL into your
                                      browser:
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    align="left"
                                    style="
                                      font-size: 0px;
                                      padding: 10px 25px;
                                      word-break: break-word;
                                    "
                                  >
                                    <div
                                      style="
                                        font-family: Ubuntu, Helvetica, Arial,
                                          sans-serif;
                                        font-size: 13px;
                                        line-height: 1;
                                        text-align: left;
                                        color: ${color.text};
                                      "
                                    >
                                      <mj-button
                                        href="${url}"
                                        target="_blank"
                                        rel="noreferrer"
                                        >${url}</mj-button
                                      >
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    align="center"
                                    style="
                                      font-size: 0px;
                                      padding: 10px 25px;
                                      word-break: break-word;
                                    "
                                  >
                                    <p
                                      style="
                                        border-top: solid 1px ${color.border};
                                        font-size: 1px;
                                        margin: 0px auto;
                                        width: 100%;
                                      "
                                    ></p>
                                    <!--[if mso | IE
                                      ]><table
                                        align="center"
                                        border="0"
                                        cellpadding="0"
                                        cellspacing="0"
                                        style="
                                          border-top: solid 1px ${color.border};
                                          font-size: 1px;
                                          margin: 0px auto;
                                          width: 550px;
                                        "
                                        role="presentation"
                                        width="550px"
                                      >
                                        <tr>
                                          <td style="height: 0; line-height: 0">
                                            &nbsp;
                                          </td>
                                        </tr>
                                      </table><!
                                    [endif]-->
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    align="left"
                                    style="
                                      font-size: 0px;
                                      padding: 10px 25px;
                                      word-break: break-word;
                                    "
                                  >
                                    <div
                                      style="
                                        font-family: Ubuntu, Helvetica, Arial,
                                          sans-serif;
                                        font-size: 13px;
                                        line-height: 1;
                                        text-align: left;
                                        color: ${color.text};
                                      "
                                    >
                                      This invitation was intended for
                                      <span color="black">${email}</span>. If
                                      you were not expecting this invitation,
                                      you can ignore this email. If you are
                                      concerned about your account's safety,
                                      please reply to this email to get in touch
                                      with us.
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <!--[if mso | IE]></td></tr></table><![endif]-->
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!--[if mso | IE]></td></tr></table></td></tr></table><![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!--[if mso | IE]></td></tr></table><![endif]-->
    </div>
  </body>
</html>

`;
}

/** Email Text body (fallback for email clients that don't render HTML, e.g. feature phones) */
function text({ url, host }: { url: string; host: string }) {
  return `Sign in to ${host}\n${url}\n\n`;
}
