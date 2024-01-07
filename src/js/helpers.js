import { TIMEOUT_SEC } from "./config";

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadDate = undefined) {
  try {
    const fetchPromise = uploadDate
      ? fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(uploadDate),
        })
      : fetch(url);

    const res = await Promise.race([fetchPromise, timeout(TIMEOUT_SEC)]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message}`);
    return data;
  } catch (error) {
    throw error;
  }
};
/*
export const getJson = async function (url) {
  try {
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message}`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const sendJson = async function (url, uploadData) {
  try {
    const res = await Promise.race([
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(uploadData),
      }),
      timeout(TIMEOUT_SEC),
    ]);

    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message}`);

    return data;
  } catch (error) {
    throw error;
  }
};

*/
export const truncateString = function (str, num) {
  if (str.length > num) {
    return str.slice(0, num) + "...";
  } else {
    return str;
  }
};

export const onHold = function (callback, interval) {
  let isHolding = false;
  let holdInterval;

  function startHold(...args) {
    isHolding = true;
    callback(...args);
    holdInterval = setInterval(callback, interval, ...args);
  }

  function endHold() {
    isHolding = false;
    clearInterval(holdInterval);
  }

  return {
    startHold,
    endHold,
  };
};
