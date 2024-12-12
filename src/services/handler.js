const puppeteer = require("puppeteer");

const fetchUrlEpisode = async (url, episode) => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox"],
  });

  const page = await browser.newPage();

  await page.goto(url);

  const resultList = await page.evaluate(() => {
    const list = document.querySelectorAll(".episodelist ul li");
    const convertedList = Array.from(list).map((item) => {
      const titleEpisode = item.querySelector("a").innerText;
      const linkNext = item.querySelector("a").getAttribute("href");
      return {
        title: titleEpisode,
        url: linkNext,
      };
    });
    return convertedList;
  });

  const resultFiltered = resultList.filter(
    (item) => item.title.includes(episode) && item.url.includes("episode")
  );
  const resultSorted = resultFiltered.sort((min, max) => {
    return (min.title > max.title) - (min.title < max.title);
  });
  console.log("Result: ", resultSorted);
  await browser.close();
  return resultSorted[0];
};

module.exports = {
  fetchUrlEpisode,
};
