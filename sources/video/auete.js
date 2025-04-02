class AUETE extends VideoExtension {
  id = 'cd9967a1e65d4c8bad58ff873918a925';
  name = 'AUETE';
  version = '0.0.1';
  baseUrl = 'https://auete.cc/';
  async getRecommendVideos(pageNo, type) {
    const items = [
      {
        name: '热映',
        tag: '',
      },
      {
        name: '电影',
        tag: 'Movie/index.html',
      },
      {
        name: '电视剧',
        tag: 'Tv/index.html',
      },
      {
        name: '动漫',
        tag: 'Dm/index.html',
      },
      {
        name: '其他',
        tag: 'qita/index.html',
      },
    ];
    if (!type) {
      return items.map((item) => ({
        id: this.urlJoin(this.baseUrl, item.tag),
        type: item.name,
        list: [],
        page: pageNo,
        totalPage: 1,
        sourceId: '',
      }));
    }
    const item = items.find((item) => item.name === type);
    pageNo ||= 1;
    let url;
    if (pageNo === 1) {
      url = this.urlJoin(this.baseUrl, item.tag);
    } else {
      url = this.urlJoin(
        this.baseUrl,
        item.tag.replace('index.html', `index${pageNo}.html`)
      );
    }
    const document = await this.fetchDom(url);
    const list = await this.queryVideoElements(document, {
      element: '.row ul li[data-tid]',
      cover: 'img',
      title: 'h2 a',
      url: 'h2 a',
      status: '.hdtag',
      latestUpdate: '.date .hidden-lg',
    });
    console.log(list);
    const pageElements = document?.querySelectorAll('.pagination li a');
    return {
      list,
      page: pageNo,
      totalPage: this.maxPageNoFromElements(pageElements),
      type: item.name,
      sourceId: '',
    };
  }

  async search(keyword, pageNo) {
    return null;
  }

  async getVideoDetail(item, pageNo) {
    pageNo ||= 1;
    const document = await this.fetchDom(item.url);
    const infos = Array.from(document.querySelectorAll('.message p').values());
    infos.forEach((info, index) => {
      const text = info.textContent.trim();
      if (!text) return;
      switch (true) {
        case text.startsWith('◎影片导演:'):
          item.director = text.replace('◎影片导演:', '');
          break;
        case text.startsWith('◎影片主演:'):
          item.cast = text.replace('◎影片主演:', '');
          break;
        case text.startsWith('◎影片分类:'):
          item.tags = text.replace('◎影片分类:', '');
          break;
        case text.startsWith('◎影片地区:'):
          item.country = text.replace('◎影片地区:', '');
          break;
        case text.startsWith('◎上映年份:'):
          item.releaseDate = text.replace('◎上映年份:', '');
          break;
        case text.startsWith('◎影片时长:'):
          item.duration = text.replace('◎影片时长:', '');
          break;
        case text.startsWith('◎影片简介:'):
          console.log('infos[index + 1]', infos[index + 1]);

          if (infos[index + 1]) {
            item.intro = infos[index + 1].textContent
              .replace('◎影片简介:', '')
              .trim();
          }
          break;
      }
    });
    const resources = [];
    const playlists = document.querySelectorAll('#player_list');
    playlists.forEach((playlist) => {
      const title = playlist.querySelector('h2')?.textContent;
      const episodes = [];
      const elements = playlist.querySelectorAll('ul li a[href]');
      elements.forEach((a) => {
        const url = this.urlJoin(this.baseUrl, a.getAttribute('href'));
        episodes.push({
          id: url,
          title: a.textContent,
          url: url,
        });
      });
      resources.push({
        id: title,
        title: title,
        episodes: episodes,
      });
    });
    item.resources = resources;
    return item;
  }

  async getPlayUrl(item, resource, episode) {
    const response = await this.fetch(episode.url);
    const text = await response.text();
    const regex = /var\s+now\s*=\s*base64decode\("([^"]+)"\)/;
    const match = text.match(regex);
    if (match && match[1]) {
      const base64String = match[1];
      return { url: atob(base64String) };
    }
  }
}

return AUETE;
