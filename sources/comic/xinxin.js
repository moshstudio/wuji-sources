class XinXin extends ComicExtension {
  id = "b610ff4b50a14346b290a0d9eaba7c16";
  name = "新新漫画";
  version = '0.0.1';
  baseUrl = 'https://www.77mh.nl/';
  async getRecommendComics(pageNo, type) {
    let items = [
      {
        name: '热血机甲',
        category: 'rexue',
      },
      {
        name: '科幻未来',
        category: 'kehuan',
      },
      {
        name: '恐怖惊悚',
        category: 'kongbu',
      },
      {
        name: '推理悬疑',
        category: 'xuanyi',
      },
      {
        name: '滑稽搞笑',
        category: 'gaoxiao',
      },
      {
        name: '恋爱生活',
        category: 'love',
      },
      {
        name: '纯爱人生',
        category: 'danmei',
      },
      {
        name: '体育竞技',
        category: 'tiyu',
      },
      {
        name: '纯情少女',
        category: 'chunqing',
      },
      {
        name: '魔法奇幻',
        category: 'qihuan',
      },
      {
        name: '武侠经典',
        category: 'wuxia',
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
    const url =
      pageNo === 1
        ? `${this.baseUrl}${item.category}/index.html`
        : `${this.baseUrl}${item.category}/index_${pageNo}.html`;
    const body = await this.fetchDom(url);
    const list = await this.queryComicElements(body, {
      element: '.main_left dl',
      cover: 'img',
      title: 'h1 a',
      intro: '.info',
      author: '.author a',
      status: '.status a',
      url: 'h1 a',
    });
    const pageElements = body.querySelectorAll('.pages_s a');
    return {
      list,
      page: pageNo,
      totalPage: this.maxPageNoFromElements(pageElements),
    };
  }

  async search(keyword, pageNo) {
    pageNo ||= 1;
    const url = `https://so.77mh.nl/k.php?k=${keyword}&p=${pageNo}`;
    const body = await this.fetchDom(url);
    const list = await this.queryComicElements(body, {
      element: '.main_left dl',
      cover: 'img',
      title: 'h1 a',
      intro: '.info',
      author: '.author a',
      status: '.status a',
      url: 'h1 a',
    });
    const pageElement = body.querySelector('.pages_s span');
    const totalPage = Number(pageElement?.textContent?.split('/').pop());

    return {
      list,
      page: pageNo,
      totalPage,
    };
  }

  async getComicDetail(item, pageNo) {
    pageNo ||= 1;
    const body = await this.fetchDom(item.url);
    const chapters = await this.queryChapters(body, {
      element: '.ar_list_col a',
    });
    item.chapters = chapters.reverse();
    return item;
  }

  async getContent(item, chapter) {
    const response = await this.fetch(chapter.url);
    const text = await response.text();
    const regx = /return p}\((.*)\)/;
    const params = regx.exec(text)[1].split(',');
    const ret = this.test(
      params[0],
      Number(params[1]),
      Number(params[2]),
      params[3].split('|'),
      Number(params[4]),
      {}
    );
    const imageS = /img_s=(\d+);/.exec(ret)[1];
    const regx2 = /msg=\\\'([^;]*)\\\';/;
    const images = regx2.exec(ret)[1].split('|');
    return {
      photos: images.map(
        (item) => `https://picsh.77dm.top/h${imageS}/${item.replace("'", '')}`
      ),
      page: 1,
      totalPage: 1,
    };
  }
  test(p, a, c, k, e, d) {
    e = function (c) {
      return (
        (c < a ? '' : e(parseInt(c / a))) +
        ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36))
      );
    };
    if (true) {
      while (c--) {
        d[e(c)] = k[c] || e(c);
      }
      k = [
        function (e) {
          return d[e];
        },
      ];
      e = function () {
        return '\\w+';
      };
      c = 1;
    }
    while (c--) {
      if (k[c]) {
        p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]);
      }
    }
    return p;
  }
}

return XinXin;
