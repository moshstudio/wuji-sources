class DMZJ extends ComicExtension {
  id = "96a88fa9ab424ed2a022fde498a75fc1";
  name = "动漫之家";
  version = '0.0.1';
  baseUrl = 'https://www.dmzj.com/';
  async getRecommendComics(pageNo, type) {
    let items = [
      {
        name: '少年',
        tag: '3262',
        theme: '0',
      },
      {
        name: '少女',
        tag: '3263',
        theme: '0',
      },
      {
        name: '青年',
        tag: '3264',
        theme: '0',
      },
      {
        name: '搞笑',
        tag: '0',
        theme: '1',
      },
      {
        name: '科幻',
        tag: '0',
        theme: '2',
      },
      {
        name: '魔法',
        tag: '0',
        theme: '3',
      },
      {
        name: '热血',
        tag: '0',
        theme: '4',
      },
      {
        name: '冒险',
        tag: '0',
        theme: '5',
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
    const url = `${this.baseUrl}api/v1/comic1/rank_list`;
    const params = new URLSearchParams({
      channel: 'pc',
      app_name: 'dmzj',
      version: '1.0.0',
      timestamp: `${Date.now()}`,
      page: `${pageNo}`,
      size: '10',
      duration: '1',
      cate: '0',
      tag: `${item.tag}`,
      theme: `${item.theme}`,
    });
    const response = await this.fetch(url + '?' + params.toString());
    const json = await response.json();
    const list = json.data.list.map((item) => {
      return {
        id: item.comic_id,
        title: item.title,
        intro: item.description,
        cover: item.cover,
        author: item.authors,
        tags: item.types,
        status: item.status,
        latestChapter: item.last_update_chapter_name,
        extra: { comicPy: item.comic_py },
        sourceId: '',
      };
    });
    return {
      list,
      page: pageNo,
      totalPage: Math.ceil(json.data.totalNum / 10),
    };
  }

  async search(keyword, pageNo) {
    pageNo ||= 1;
    const url = `${this.baseUrl}api/v1/comic1/search`;
    const params = new URLSearchParams({
      keyword: keyword,
      page: pageNo,
      size: 20,
    });

    const response = await this.fetch(url + '?' + params.toString());
    const json = await response.json();

    const list = json.data.comic_list.map((item) => {
      return {
        id: item.id,
        title: item.name,
        cover: item.cover,
        author: item.authors,
        status: item.status,
        latestChapter: item.last_update_chapter_name,
        extra: { comicPy: item.comic_py },
        sourceId: '',
      };
    });
    return {
      list,
      page: pageNo,
      totalPage: Math.ceil(json.data.total / 20),
    };
  }

  async getComicDetail(item, pageNo) {
    pageNo ||= 1;
    const url = `${this.baseUrl}api/v1/comic1/comic/detail`;
    const params = new URLSearchParams({
      channel: 'pc',
      app_name: 'dmzj',
      version: '1.0.0',
      timestamp: `${Date.now()}`,
      comic_py: `${item.extra.comicPy}`,
    });
    const response = await this.fetch(url + '?' + params.toString());
    const json = await response.json();

    item.intro = json.data.comicInfo.description;
    const chapters = json.data.comicInfo.chapterList?.[0]?.data.map((item) => {
      return {
        id: item.chapter_id,
        title: item.chapter_title,
      };
    });
    item.chapters = chapters?.reverse();
    return item;
  }

  async getContent(item, chapter) {
    const url = `${this.baseUrl}api/v1/comic1/chapter/detail`;
    const params = new URLSearchParams({
      channel: 'pc',
      app_name: 'dmzj',
      version: '1.0.0',
      timestamp: `${Date.now()}`,
      uid: '',
      comic_id: `${item.id}`,
      chapter_id: `${chapter.id}`,
    });
    const response = await this.fetch(url + '?' + params.toString());
    const json = await response.json();

    return {
      photos:
        json.data.chapterInfo.page_url_hd ||
        json.data.chapterInfo.page_url ||
        [],
      page: 1,
      totalPage: 1,
    };
  }
}

return DMZJ;
