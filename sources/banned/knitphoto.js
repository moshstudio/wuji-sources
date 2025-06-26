class KNIT extends PhotoExtension {
  id = "8042cefd0c3847b5a96c9e60794ee1fb";
  name = "爱妹子";
  version = "0.0.1";
  baseUrl = "https://xx.knit.bid/";

  async getRecommendList(pageNo) {
    pageNo ||= 1;
    let url = `${this.baseUrl}page/${pageNo}/`;
    try {
      const document = await this.fetchDom(url);

      const list = await this.queryPhotoElements(document, {
        element: ".image-container .excerpt",
        title: "h2 a",
        url: "h2 a",
      });
      const pageElements = document.querySelectorAll(
        ".pagination a, .pagination span"
      );

      return {
        list,
        page: pageNo,
        totalPage: this.maxPageNoFromElements(pageElements),
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async search(keyword, pageNo) {
    pageNo ||= 1;
    let url = `${this.baseUrl}search/page/${pageNo}/?s=${keyword}`;
    try {
      const document = await this.fetchDom(url);
      const list = await this.queryPhotoElements(document, {
        element: ".image-container .excerpt",
        title: "h2 a",
        url: "h2 a",
      });
      const pageElements = document.querySelectorAll(
        ".pagination a, .pagination span"
      );

      return {
        list,
        page: pageNo,
        totalPage: this.maxPageNoFromElements(pageElements),
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async getPhotoDetail(item, pageNo) {
    try {
      pageNo ||= 1;
      const url = this.urlJoin(item.url, `page/${pageNo}/`);
      const document = await this.fetchDom(url);
      const imgs = document.querySelectorAll(".image-container img");
      const imgItems = Array.from(imgs).map((img) =>
        this.urlJoin(URL.parse(item.url).origin, img.getAttribute("data-src"))
      );

      const pageElements = document.querySelectorAll(
        ".pagination a, .pagination span"
      );
      return {
        item,
        photos: imgItems,
        photosHeaders: { referer: item.url },
        page: pageNo,
        totalPage: this.maxPageNoFromElements(pageElements),
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

return KNIT;
