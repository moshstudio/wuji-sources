
class NiuNiu extends PhotoExtension {
  id = "603c0ae42b824eb59b3567244d3029f0"
  name = '牛牛美图';
  version = '0.0.1';
  baseUrl = 'https://www.uyn8.cn/';

  async getRecommendList(pageNo = 1) {
    pageNo ??= 1;
    const url =
      pageNo === 1
        ? `${this.baseUrl}xgmn`
        : `${this.baseUrl}xgmn/page/${pageNo}`;
    const document = await this.fetchDom(url);

    const list = await this.queryPhotoElements(document, {
      element: '.content-area .entry-media',
      title: 'img',
      cover: 'img',
      url: 'a',
    });
    list.forEach((item) => {
      item.coverHeaders = {
        referer: this.baseUrl,
      };
    });
    return {
      list: list,
      page: pageNo,
      totalPage: 11,
      sourceId: '',
    };
  }

  async search(keyword, pageNo = 1) {
    pageNo ??= 1;
    const url =
      pageNo === 1
        ? `${this.baseUrl}?s=${keyword}`
        : `${this.baseUrl}page/${pageNo}?s=${keyword}`;
    const document = await this.fetchDom(url);

    const list = await this.queryPhotoElements(document, {
      element: '.content-area .entry-media',
      title: 'img',
      cover: 'img',
      url: 'a',
    });
    list.forEach((item) => {
      item.coverHeaders = {
        referer: this.baseUrl,
      };
    });
    let hasNext = false;
    const nextPageElement = document.querySelector(
      '.nav-previous a:last-child'
    );
    if (nextPageElement && nextPageElement.textContent === '下一页') {
      hasNext = true;
    }
    return {
      list: list,
      page: pageNo,
      totalPage: hasNext ? pageNo + 1 : pageNo,
      sourceId: '',
    };
  }

  async getPhotoDetail(item, pageNo = 1) {
    const url = item.url;
    const body = await this.fetchDom(url);
    const elements = body.querySelectorAll('.entry-content img');
    const photos = [];
    for (const element of elements) {
      const src = element.getAttribute('src');
      if (src) {
        photos.push(src);
      }
    }
    return {
      item,
      photos,
      photosHeaders: {
        referer: this.baseUrl,
      },
      page: pageNo,
      totalPage: 1,
      sourceId: '',
    };
  }
}
return NiuNiu
