
class JKRS extends PhotoExtension {
  id = "ef255600ed96492b90b30124e6b3cae8";
  name = "日式JK";
  version = "0.0.1";
  baseUrl = 'https://v2.jk.rs/';

  async getRecommendList(pageNo) {
    pageNo ||= 1;
    let url = `${this.baseUrl}page/${pageNo}/`;
    try {
      const document = await this.fetchDom(url, { verify: false });
      const lists = await this.queryPhotoElements(document, {
        element: '#masonry .item',
        cover: 'img',
        title: '.item-link-text',
        hot: '.item-num',
        url: '.item-link',
      });
      const pageElements = document.querySelectorAll('.page-navigator a');
      return {
        list: lists,
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
    let url = `${this.baseUrl}search/${keyword}/`;
    try {
      const document = await this.fetchDom(url, { verify: false });
      const lists = await this.queryPhotoElements(document, {
        element: '#masonry .item',
        cover: 'img',
        title: '.item-link-text',
        hot: '.item-num',
        url: '.item-link',
      });
      const pageElements = document.querySelectorAll('.page-navigator a');
      return {
        list: lists,
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
      const document = await this.fetchDom(item.url, { verify: false });
      const imgs = document.querySelectorAll('#masonry img');
      const imgItems = Array.from(imgs).map((img) =>
        img.getAttribute('data-original')
      );
      return {
        item,
        photos: imgItems,
        page: 1,
        totalPage: 1,
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

return JKRS;
