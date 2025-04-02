class DZXY extends BookExtension {
  id = "4319705b6e474cf5b2eb4a0d9febcd54";
  name = "杂志网";
  version = "0.0.1";
  baseUrl = 'https://www.52dzxy.com/';

  async getRecommendBooks(pageNo, type) {
    let items = [
      {
        name: '百科知识',
        tag: `bkzs`,
      },
      {
        name: '父母必读',
        tag: `fmbd`,
      },
      {
        name: '新民周刊',
        tag: `xmzk`,
      },
      {
        name: '第一财经',
        tag: `dycj`,
      },
      {
        name: '南风窗',
        tag: `nfc`,
      },
      {
        name: '环球人物',
        tag: `hqrw`,
      },
      {
        name: '轻兵器',
        tag: `qbq`,
      },
      {
        name: '知识就是力量',
        tag: `zsjsll`,
      },
      {
        name: '中小学心理健康教育',
        tag: `zxxxljkjy`,
      },
      {
        name: '中国经济周刊',
        tag: `zgjjzk`,
      },
      {
        name: '证券市场周刊',
        tag: `zqsczk`,
      },
      {
        name: '股市动态分析',
        tag: `bkzs`,
      },
      {
        name: '财经',
        tag: `caijing`,
      },
      {
        name: '婚姻与家庭',
        tag: `hyyjtxqdb`,
      },
      {
        name: '南方人物周刊',
        tag: `nfrwzk`,
      },
      {
        name: '中国新闻周刊',
        tag: `zgxwzk`,
      },
      {
        name: '看世界',
        tag: `ksj`,
      },
      {
        name: '阅读时代',
        tag: `ydsd`,
      },
      {
        name: '格言校园版',
        tag: `gyxyb`,
      },
      {
        name: '海外文摘',
        tag: `hwwz`,
      },
      {
        name: '思维与智慧',
        tag: `swyzhsby`,
      },
      {
        name: '青年文摘',
        tag: `qnwz`,
      },
      {
        name: '今日文摘',
        tag: `jrwz`,
      },
    ];
    if (!type) {
      return items.map((item) => ({
        id: item.tag,
        type: item.name,
        list: [],
        page: pageNo,
        sourceId: '',
      }));
    }
    const item = items.find((item) => item.name === type);
    if (!item) return null;
    pageNo = pageNo || 1;
    let url = `${this.baseUrl}${item.tag}/all.html`;
    const document = await this.fetchDom(url);

    const list = await this.queryBookElements(document, {
      element: '.container .magazine-item',
      title: 'a',
      url: 'a',
    });

    list.forEach((i) => {
      i.title = `${i.title}(${item.name})`;
    });

    return {
      list,
      page: pageNo,
      totalPage: 1,
      type: item.name,
      sourceId: '',
    };
  }

  async search(keyword, pageNo) {
    return null;
  }

  async getBookDetail(item) {
    let url = item.url;
    const document = await this.fetchDom(url);
    const chapters = [];

    let elements = Array.from(document.querySelectorAll('.maglistbox a[href]'));
    if (!elements.length) {
      elements = Array.from(
        document.querySelectorAll('.catalog-container a[href]')
      );
    }
    elements.forEach((element) => {
      const url = this.urlJoin(
        item.url.split('/').slice(0, -1).join('/'),
        element.getAttribute('href')
      );
      chapters.push({
        id: url,
        title: element.textContent.trim(),
        url: url,
      });
    });

    item.chapters = chapters;
    return item;
  }

  async getContent(item, chapter) {
    let url = chapter.url;
    const document = await this.fetchDom(url);
    let articleContent = document.querySelector('.article-content');
    if (!articleContent) {
      articleContent = document.querySelector('.blkContainerSblkCon');
    }
    let text = '';

    articleContent.childNodes.forEach((node) => {
      if (
        node.nodeType === Node.ELEMENT_NODE &&
        !node.classList.contains('contentAd')
      ) {
        text += node.textContent + '\n'; // 在每个元素后添加换行符
      }
    });
    return text;
  }
}
  

return DZXY;
