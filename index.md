---
layout: default
title: 首页
---

[作者主页](https://github.com/angryLid/angrylid.github.io)


<div class="archive">
  <div class="timeline" id="timeline">
    {% assign posts_by_year = site.posts | group_by_exp:"post", "post.date | date: '%Y' " %}
    {% for group in posts_by_year %}
      <div class="archive-title">
        <h4 class="archive-year">{{ group.name }}</h4>
      </div>

      <ul>
      {% for post in group.items %}
        <li><div style="width:4rem;float:left;">{{ post.date | date: "%m月%d日" }}</div> <a href="{{site.github.url }}{{ post.url }}" class="archive-item-link" title="{{post.title}}">{{ post.title }}</a></li>
      {% endfor %}
      </ul>

    {% endfor %}
  </div>
</div>
