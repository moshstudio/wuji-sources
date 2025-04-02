class BaoZi extends ComicExtension {
  id = "f0193629c1284a64bed926a1d59239b8";
  name = "包子漫画";
  version = '0.0.1';
  baseUrl = 'https://cn.baozimhcn.com/';
  async getRecommendComics(pageNo, type) {
    let items = [
      {
        name: '国漫',
        region: 'cn',
      },
      {
        name: '日本',
        region: 'jp',
      },
      {
        name: '韩国',
        region: 'kr',
      },
      {
        name: '欧美',
        region: 'en',
      },
    ];
    if (!type) {
      return items.map((item) => ({
        type: item.name,
        list: [],
        page: pageNo,
        totalPage: 1,
        sourceId: '',
      }));
    }
    const item = items.find((item) => item.name === type);
    if (!item) return null;
    pageNo = pageNo || 1;
    const url = `${this.baseUrl}api/bzmhq/amp_comic_list?type=all&region=${item.region}&filter=*&page=${pageNo}&limit=36&language=cn&__amp_source_origin=${this.baseUrl}`;
    const response = await this.fetch(url);
    const json = await response.json();
    if (!json.items) return null;

    const list = json.items.map((item) => {
      return {
        id: item.comic_id,
        title: item.name,
        author: item.author,
        cover: `https://static-tw.baozimhcn.com/cover/${item.topic_img}?w=285&h=375&q=100`,
        sourceId: '',
      };
    });
    return {
      list,
      page: pageNo,
      totalPage: 10,
    };
  }

  async search(keyword, pageNo) {
    pageNo ||= 1;
    const url = `${this.baseUrl}search?q=${keyword}`;
    const body = await this.fetchDom(url);
    const list = await this.queryComicElements(body, {
      element: '.comics-card',
      cover: 'amp-img',
      title: 'h3',
      url: '.comics-card__info',
    });

    return {
      list,
      page: pageNo,
      totalPage: 1,
    };
  }

  async getComicDetail(item, pageNo) {
    pageNo ||= 1;
    item.url ||= `${this.baseUrl}comic/${item.id}`;
    let body = await this.fetchDom(item.url);
    item.intro = body
      .querySelector('.comics-detail__desc')
      ?.textContent?.trim();
    const chapters = [];

    let elements = body.querySelectorAll(
      '#chapter-items a[href], #chapters_other_list a[href]'
    );
    if (!Array.from(elements.values()).length) {
      elements = body.querySelectorAll('.l-content:nth-child(3) a[href]');
    }
    elements.forEach((element) => {
      const title = element.querySelector('span')?.textContent?.trim();
      const url = element.getAttribute('href');
      if (title && url) {
        chapters.push({
          title,
          url: this.urlJoin(this.baseUrl, url),
        });
      }
    });

    item.chapters = chapters;
    return item;
  }

  async getContent(item, chapter) {
    const body = await this.fetchDom(chapter.url);
    const images = body.querySelectorAll('.comic-contain img');
    const photos = [];
    images.forEach((item) => {
      photos.push(
        item
          .getAttribute('src')
          .replace('.baozicdn.com/', '-mha1-nlams.baozicdn.com/')
      );
    });

    return {
      photos,
      page: 1,
      totalPage: 1,
    };
  }
}

return BaoZi;
