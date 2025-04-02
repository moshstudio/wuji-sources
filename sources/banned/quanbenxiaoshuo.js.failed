class QuanBen extends BookExtension {
  id = "945cc9dacb564aee99929f90c4ce3298";
  name = "全本小说网(需代理)";
  version = '0.0.1';
  baseUrl = 'https://www.quanben.io/';

  async getRecommendBooks(pageNo, type) {
    let items = [
      {
        name: '玄幻',
        url: this.urlJoin(this.baseUrl, 'c/xuanhuan.html'),
      },
      {
        name: '都市',
        url: this.urlJoin(this.baseUrl, 'c/dushi.html'),
      },
      {
        name: '言情',
        url: this.urlJoin(this.baseUrl, 'c/yanqing.html'),
      },
      {
        name: '穿越',
        url: this.urlJoin(this.baseUrl, 'c/chuanyue.html'),
      },
      {
        name: '青春',
        url: this.urlJoin(this.baseUrl, 'c/qingchun.html'),
      },
      {
        name: '仙侠',
        url: this.urlJoin(this.baseUrl, 'c/xianxia.html'),
      },
      {
        name: '灵异',
        url: this.urlJoin(this.baseUrl, 'c/lingyi.html'),
      },
      {
        name: '悬疑',
        url: this.urlJoin(this.baseUrl, 'c/xuanyi.html'),
      },
      {
        name: '历史',
        url: this.urlJoin(this.baseUrl, 'c/lishi.html'),
      },
      {
        name: '军事',
        url: this.urlJoin(this.baseUrl, 'c/junshi.html'),
      },
      {
        name: '游戏',
        url: this.urlJoin(this.baseUrl, 'c/youxi.html'),
      },
      {
        name: '竞技',
        url: this.urlJoin(this.baseUrl, 'c/jingji.html'),
      },
      {
        name: '科幻',
        url: this.urlJoin(this.baseUrl, 'c/kehuan.html'),
      },
      {
        name: '职场',
        url: this.urlJoin(this.baseUrl, 'c/zhichang.html'),
      },
      {
        name: '官场',
        url: this.urlJoin(this.baseUrl, 'c/guanchang.html'),
      },
      {
        name: '现言',
        url: this.urlJoin(this.baseUrl, 'c/xianyan.html'),
      },
      {
        name: '耽美',
        url: this.urlJoin(this.baseUrl, 'c/danmei.html'),
      },
      {
        name: '其他',
        url: this.urlJoin(this.baseUrl, 'c/qita.html'),
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
    let url = item.url;
    if (pageNo > 1) {
      url = url.replace('.html', `_${pageNo}.html`);
    }
    const document = await this.fetchDom(url);

    const list = await this.queryBookElements(document, {
      element: '.box .row',
      cover: 'img',
      title: 'h3 a',
      intro: '[itemprop="description"]',
      author: '[itemprop="author"]',
    });

    const pageElement = document.querySelector('.cur_page');
    let totalPage = pageNo;
    if (pageElement?.textContent?.includes('/')) {
      totalPage = pageElement.textContent?.split('/')[1].trim();
    }
    return {
      list: list,
      page: pageNo,
      totalPage: totalPage,
    };
  }

  async search(keyword, pageNo) {
    const url = `${this.baseUrl}index.php?c=book&a=search&keywords=${keyword}`;
    const document = await this.fetchDom(url);
    const list = await this.queryBookElements(document, {
      element: '.box .row',
      cover: 'img',
      title: 'h3 a',
      intro: '[itemprop="description"]',
      author: '[itemprop="author"]',
    });
    return {
      list: list,
      page: 1,
      totalPage: 1,
    };
  }

  async getBookDetail(item) {
    if (!item.url) return null;
    const url = `${item.url}/list.html`;
    const body = await this.fetchDom(url);

    // 使用正则表达式提取 callback 的值
    var callbackMatch =
      body.documentElement.outerHTML.match(/var callback='(.*?)'/);
    var bookIdMatch = body.documentElement.outerHTML.match(
      /onclick=\"load_more\('(.*?)'\)\"/
    );

    // 如果匹配成功，提取的值在 match[1] 中
    if (callbackMatch && bookIdMatch) {
      var callbackValue = callbackMatch[1];
      var bookId = bookIdMatch[1];
      function base64(_str) {
        var staticchars =
          'PXhw7UT1B0a9kQDKZsjIASmOezxYG4CHo5Jyfg2b8FLpEvRr3WtVnlqMidu6cN';
        var encodechars = '';
        for (var i = 0; i < _str.length; i++) {
          var num0 = staticchars.indexOf(_str[i]);
          if (num0 == -1) {
            var code = _str[i];
          } else {
            var code = staticchars[(num0 + 3) % 62];
          }
          var num1 = parseInt(Math.random() * 62, 10);
          var num2 = parseInt(Math.random() * 62, 10);
          encodechars += staticchars[num1] + code + staticchars[num2];
        }
        return encodechars;
      }

      const moreUrl = `${this.baseUrl}index.php?c=book&a=list.jsonp&callback=${callbackValue}&book_id=${bookId}&b=${base64(callbackValue)}`;
      const moreResponse = await this.fetch(moreUrl, {
        headers: {
          referer: url,
        },
      });
      const jsonString = (await moreResponse.text()).match(/{.*}/)[0];
      if (jsonString) {
        const json = JSON.parse(jsonString);
        const tempContainer = body.querySelector('.c');
        tempContainer.innerHTML = json.content;
      }
    }

    const chapterElements = body.querySelectorAll(
      '[itemprop="itemListElement"]'
    );

    const chapters = [];
    chapterElements.forEach((element) => {
      const href = element.querySelector('a').getAttribute('href');
      if (!href) {
        return;
      }
      const url = this.urlJoin(this.baseUrl, href);
      const title = element.querySelector('span').textContent;
      chapters.push({
        id: url,
        title: title || '',
        url,
      });
    });

    item.chapters = chapters;

    return item;
  }

  async getContent(item, chapter) {
    if (!chapter.url) return '';
    const body = await this.fetchDom(chapter.url);
    return Array.from(body.querySelectorAll('#content p'))
      .map((p) => p.textContent || '')
      .join('\n');
  }
}

return QuanBen;
