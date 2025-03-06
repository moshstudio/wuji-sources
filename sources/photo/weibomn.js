
class WeiBoMN extends PhotoExtension {
  id = "62dd1de623d3405a802c3e0e3c37d122"
  name = '微博美女';
  version = '0.0.1';
  baseUrl = 'http://www.weibomn.com/';

  async getRecommendList(pageNo) {
    pageNo ||= 1;
    let url = `${this.baseUrl}list_${pageNo}.html`;
    if (pageNo === 1) {
      url = this.baseUrl;
    }
    try {
      const document = await this.fetchDom(url, {
        headers: {
          'upgrade-insecure-requests': '1',
        },
        verify: false,
      });
      const lists = await this.queryPhotoElements(document, {
        element: '.container .card',
        cover: 'img',
        title: 'img',
        hot: 'small',
        url: 'a',
      });

      return {
        list: lists,
        page: pageNo,
        totalPage: 74,
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async search(keyword, pageNo) {
    return null;
  }
  async getPhotoDetail(item, pageNo) {
    try {
      const document = await this.fetchDom(item.url, {
        headers: {
          'upgrade-insecure-requests': '1',
        },
        verify: false,
      });
      const imgs = document.querySelectorAll('.page-container img');
      const imgItems = Array.from(imgs).map((img) => img.getAttribute('src'));
      return {
        item,
        photos: imgItems,
        photosHeaders: { 'upgrade-insecure-requests': '1', },
        page: 1,
        totalPage: 1,
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
return WeiBoMN
