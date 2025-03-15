class KanShuGe extends BookExtension {
  id = "6a6825cde0394b38ac56335838f36067";
  name = "看书阁";
  version = '0.0.1';
  baseUrl = 'https://m.xseeshu.net/';

  async getRecommendBooks(pageNo, type) {
    let items = [
      {
        name: '玄幻修真',
        url: `${this.baseUrl}list/1`,
      },
      {
        name: '重生穿越',
        url: `${this.baseUrl}list/2`,
      },
      {
        name: '都市小说',
        url: `${this.baseUrl}list/3`,
      },
      {
        name: '军事小说',
        url: `${this.baseUrl}list/4`,
      },
      {
        name: '网游小说',
        url: `${this.baseUrl}list/5`,
      },
      {
        name: '科幻小说',
        url: `${this.baseUrl}list/6`,
      },
      {
        name: '灵异小说',
        url: `${this.baseUrl}list/7`,
      },
      {
        name: '言情小说',
        url: `${this.baseUrl}list/8`,
      },
      {
        name: '其他小说',
        url: `${this.baseUrl}list/9`,
      },
    ];
    if (!type) {
      return items.map((item) => ({
        id: item.url,
        type: item.name,
        list: [],
        page: pageNo,
        sourceId: '',
      }));
    }
    const item = items.find((item) => item.name === type);
    if (!item) return null;
    pageNo = pageNo || 1;
    let url = `${item.url}/${pageNo}.html`;
    const document = await this.fetchDom(url);

    const list = await this.queryBookElements(document, {
      element: '.sort_list li',
      title: '.s2 a',
      latestUpdate: '.s5',
      tags: '.s1',
      url: '.s2 a',
    });

    const pageElements = document.querySelectorAll('.sort_page_num a');

    return {
      list: list,
      page: pageNo,
      totalPage: this.maxPageNoFromElements(pageElements),
      type: item.name,
      sourceId: '',
    };
  }

  async search(keyword, pageNo) {
    const url = `https://m.xseeshu.net/search.html`;
    const formData = new FormData();
    formData.append('s', keyword);
    const document = await this.fetchDom(url, {
      method: 'POST',
      body: formData,
    });
    const list = await this.queryBookElements(document, {
      element: '.sort_list li',
      title: '.s2 a',
      latestUpdate: '.s5',
      tags: '.s1',
      url: '.s2 a',
    });

    const pageElements = document.querySelectorAll('.sort_page_num a');

    return {
      list: list,
      page: pageNo,
      totalPage: this.maxPageNoFromElements(pageElements),
      sourceId: '',
    };
  }

  async getBookDetail(item) {
    const url = item.url.replace('\/loop/', '\/list\/');
    const document = await this.fetchDom(url);
    item.cover = this.urlJoin(
      this.baseUrl,
      document.querySelector('.book-img img').getAttribute('src')
    );
    item.author = document.querySelector('.bookname h1').textContent.trim();

    const options = Array.from(
      document
        .querySelector('.page_num')
        .querySelectorAll('select option')
        .values()
    );
    const getChapters = (body) => {
      const chapterLists = Array.from(
        body.querySelectorAll('.chapter-list').values()
      );
      const chapterList = chapterLists.pop();
      if (chapterList) {
        return chapterList
          .querySelectorAll('li a')
          .values()
          .map((a) => {
            const url = this.urlJoin(this.baseUrl, a.getAttribute('href'));
            return {
              id: url,
              title: a.textContent.trim(),
              url: url,
            };
          });
      }
      return [];
    };
    const chapters = Array.from({ length: options.length }, () => []);
    await Promise.all(
      options.map(async (option, index) => {
        const url = this.urlJoin(this.baseUrl, option.getAttribute('value'));
        const document = await this.fetchDom(url);
        chapters[index].push(...getChapters(document));
      })
    );
    item.chapters = chapters.flat();
    return item;
  }

  async getContent(item, chapter) {
    const id = chapter.url.split('/').pop().replace('.html', '');

    const getContent = async (url, id) => {
      const body = await this.fetchDom(url);
      let res = Array.from(body.querySelectorAll('.txt p'))
        .map((p) => p.textContent || '')
        .join('\n');
      const nextElement = body.querySelector('.next a');
      if (nextElement && nextElement.getAttribute('href')?.includes(id)) {
        res =
          res +
          (await getContent(
            this.urlJoin(this.baseUrl, nextElement.getAttribute('href')),
            id
          ));
      }
      return res;
    };
    return await getContent(chapter.url, id);
  }
}

return KanShuGe;
