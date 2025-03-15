class ManHuaBa extends ComicExtension {
  id = "b3f14ebd92224c04bbbc65d12c9dd016";
  name = "漫画吧";
  version = '0.0.1';
  baseUrl = 'http://www.manhuaba.com/';
  async getRecommendComics(pageNo, type) {
    let items = [
      {
        name: '国产',
        category: '1',
      },
      {
        name: '日本',
        category: '2',
      },
      {
        name: '韩国',
        category: '3',
      },
      {
        name: '欧美',
        category: '4',
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
    const url = `${this.baseUrl}category/list/${item.category}/page/${pageNo}`;
    const body = await this.fetchDom(url);
    const list = await this.queryComicElements(body, {
      element: '.module-items a',
      cover: 'img',
      title: '.module-poster-item-title',
      url: '',
      latestChapter: '.module-item-note',
    });
    const pageElements = body.querySelectorAll('#page .paediy a');
    return {
      list,
      page: pageNo,
      totalPage: this.maxPageNoFromElements(pageElements),
    };
  }

  async search(keyword, pageNo) {
    pageNo ||= 1;
    const url = `${this.baseUrl}search/${keyword}/${pageNo}`;
    const body = await this.fetchDom(url);
    const list = await this.queryComicElements(body, {
      element: '.module-items a',
      cover: 'img',
      title: '.module-poster-item-title',
      url: '',
      latestChapter: '.module-item-note',
    });
    const pageElements = body.querySelectorAll('#page .paediy a');
    return {
      list,
      page: pageNo,
      totalPage: this.maxPageNoFromElements(pageElements),
    };
  }

  async getComicDetail(item, pageNo) {
    pageNo ||= 1;
    const body = await this.fetchDom(item.url);

    item.intro = body.querySelector(
      '.module-info-introduction-content p'
    )?.textContent;
    const chapters = await this.queryChapters(body, {
      element: '.module-play-list a',
    });
    item.chapters = chapters;
    return item;
  }

  async getContent(item, chapter) {
    const response = await this.fetch(chapter.url);
    const t = await response.text();
    const match = t.match(/params\s*=\s*'(.*)'/);
    if (!match) return null;
    const paramsString = match[1];
    const json = JSON.parse(this.decrypt(paramsString));
    if (!json.images) return null;

    return {
      photos: json.images,
      page: 1,
      totalPage: 1,
    };
  }
  decrypt(data) {
    // Base64解码
    const b64Decode = this.cryptoJs.enc.Base64.parse(data);

    // 提取IV和密文
    const iv = this.cryptoJs.lib.WordArray.create(b64Decode.words.slice(0, 4)); // 前16字节是IV
    const text = this.cryptoJs.lib.WordArray.create(b64Decode.words.slice(4)); // 后面的字节是密文

    // 密钥
    const key = this.cryptoJs.enc.Utf8.parse('9S8$vJnU2ANeSRoF');

    // 解密
    const decrypted = this.cryptoJs.AES.decrypt({ ciphertext: text }, key, {
      iv: iv,
      mode: this.cryptoJs.mode.CBC,
      padding: this.cryptoJs.pad.Pkcs7,
    });

    // 将解密后的数据转换为UTF-8字符串
    const decryptedText = decrypted.toString(this.cryptoJs.enc.Utf8);

    return decryptedText;
  }
}

return ManHuaBa;
