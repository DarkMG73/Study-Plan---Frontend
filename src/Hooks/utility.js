export function hyphenate(string, indexBreakPoint, separator) {
  const firstHalf = string.substring(0, indexBreakPoint);
  const secondHalf = string.substring(indexBreakPoint, string.length);
  return firstHalf + separator + secondHalf;
}

export function numberToText(number) {
  const ones = [
    "",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
  ];
  // const tens = [
  //   "",
  //   "",
  //   "twenty",
  //   "thirty",
  //   "fourty",
  //   "fifty",
  //   "sixty",
  //   "seventy",
  //   "eighty",
  //   "ninety",
  // ];

  if (number < 20) return ones[number];
}

export function isValidHttpUrl(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

export const refreshTokenSetup = (res) => {
  // Timing to renew access token
  let refreshTiming = (res.tokenObj.expires_in || 3600 - 5 * 60) * 1000;

  const refreshToken = async () => {
    const newAuthRes = await res.reloadAuthResponse();
    refreshTiming = (newAuthRes.expires_in || 3600 - 5 * 60) * 1000;
    if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
      console.log(
        "%cNew Auth Response:",
        "color:#94283a;background:#f0f0ef;padding:14px;border-radius:0 25px 25px 0",
        newAuthRes
      );
    }

    // saveUserToken(newAuthRes.access_token);  <-- save new token
    localStorage.setItem("authToken", newAuthRes.identifier_token);

    // Setup the other timer after the first one
    setTimeout(refreshToken, refreshTiming);
  };

  // Setup first refresh timer
  setTimeout(refreshToken, refreshTiming);
};

/// Convert string to title case /////////////////////////////
export const toTitleCase = (str, spaceAtCamelCase, dashAtCamelCase) => {
  if (!str) return "NO STRING PROVIDED TO toTitleCase";
  if (spaceAtCamelCase) {
    str = [...str].map((character) => {
      /* eslint eqeqeq: 0 */
      if (isNaN(character * 1) && character == character.toUpperCase()) {
        return " " + character;
      }

      return character;
    });
  }
  if (dashAtCamelCase) {
    str = [...str].map((character) => {
      if (isNaN(character * 1) && character == character.toUpperCase()) {
        return "-" + character;
      }

      return character;
    });
  }
  if (str.constructor === Array) str = str.join("");
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

/// Convert string to title case /////////////////////////////
export const toCamelCase = (str) => {
  const trimStr = str.trim();
  let nextLetterToUpper = false;
  let outputStr = [...trimStr].map((character, i) => {
    if (i === 0) return character;
    if (isNaN(character * 1)) {
      if (character == "-" || character == " ") {
        nextLetterToUpper = true;
        return "";
      } else if (isNaN(character * 1) && nextLetterToUpper) {
        return character.toUpperCase();
      }
    }
    nextLetterToUpper = false;
    return character;
  });

  if (outputStr.constructor === Array) outputStr = outputStr.join("");
  return outputStr;
};
