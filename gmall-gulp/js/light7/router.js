// jshint ignore: start
/*
 * 路由器
 */
+function ($) {
  "use strict";

  if (!window.CustomEvent) {
    window.CustomEvent = function (type, config) {
      var e = document.createEvent('CustomEvent');
      e.initCustomEvent(type, config.bubbles, config.cancelable, config.detail, config.id);
      return e;
    };
  }

  var Router = function() {
    this.state = sessionStorage;
    this.state.setItem("stateid", parseInt(this.state.getItem("stateid") || 1)+1);
    this.state.setItem("currentStateID", this.state.getItem("stateid"));
    this.stack = sessionStorage;
    this.stack.setItem("back", "[]");  //返回栈, {url, pageid, stateid}
    this.stack.setItem("forward", "[]");  //前进栈, {url, pageid, stateid}
    this.extras = {}; //page extra: popup, panel...
    this.init();
    this.xhr = null;
  }

  Router.prototype.defaults = {
    transition: true
  };

  Router.prototype.init = function() {
    var currentPage = this.getCurrentPage();
    if(!currentPage[0]) currentPage = $(".page").eq(0).addClass("page-current");
    var hash = location.hash;
    if(currentPage[0] && !currentPage[0].id) currentPage[0].id = (hash ? hash.slice(1) : this.genRandomID());

    if(!currentPage[0]) throw new Error("can't find .page element");
    this.initPage(currentPage[0]);
    var newCurrentPage = $(hash);


    if(newCurrentPage[0] && (!currentPage[0] || hash.slice(1) !== currentPage[0].id)) {
      currentPage.removeClass("page-current");
      newCurrentPage.addClass("page-current");
      currentPage = newCurrentPage;
    }

    //第一次加载的时候，初识话当前页面的state
    var state = history.state;
    if(!state) {
      var id = this.genStateID();
      this.replaceState(location.href, id);
      this.setCurrentStateID(id);
    }


    // var self = this;
    // window.addEventListener('load', function() {
    //   //解决safari的一个bug，safari会在首次加载页面的时候触发 popstate 事件，通过setTimeout 做延迟来忽略这个错误的事件。
    //   //参考 https://github.com/visionmedia/page.js/pull/239/files
    //   setTimeout(function() {
    //     window.addEventListener('popstate', $.proxy(self.onpopstate, self));
    //   }, 0);
    // }, false);
    // 不能 onload 这后再初始化，否则如果页面图片很多，用户跳转了都还没初始化。
    // 如果 safari 有问题，可以尝试忽略第一次的 popstate 事件。
    // 本地测试发现 safari 第一次 popstate 时的 event.state 参数为 null，这里已经有判断 null 再跳转的逻辑了。
    window.addEventListener('popstate', $.proxy(this.onpopstate, this));
  }

  Router.prototype.initPage = function(page){
    var $page = $(page);
    if ($page.data('ctrl')) {
      var contrller = Gmall.pages[$page.data('ctrl')];
      contrller && contrller.init && contrller.init($page, CFG);
    }
  }

  //load new page, and push to history
  Router.prototype.loadPage = function(url, noAnimation, replace, reload) {

    var param = url;

    if(noAnimation === undefined) {
      noAnimation = !this.defaults.transition;
    }

    if(typeof url === typeof "a") {
      param = {
        url: url,
        noAnimation: noAnimation,
        replace: replace,
        reload: reload
      };
    }

    this.currentPageParam = param;

    this.getPage(url, this.handlePageResult);
  }

  //load new page and replace current page inhistory
  Router.prototype.replacePage = function(url, noAnimation) {
    return this.loadPage(url, noAnimation, true);
  }

  //reload current page
  Router.prototype.reloadPage = function() {
    return this.loadPage(location.href, true, false, true);
  }

  Router.prototype.removePage = function(pageid) {
    var self = this;
    $(pageid).each(function() {
      var $page = $(this);
      if($page.data("page-remote")) {
        var pageExtra = self.extras[$page[0].id];
        pageExtra && pageExtra.remove();
        self.extras[$page[0].id] = undefined;
        $page.remove();
      }
    });
  }

  Router.prototype.handlePageResult = function(page, extra) {
    var url = this.currentPageParam.url,
      noAnimation = this.currentPageParam.noAnimation,
      replace = this.currentPageParam.replace,
      reload = this.currentPageParam.reload;

    var currentPage = this.getCurrentPage();

    var pageid = currentPage[0].id;

    var action = "pushBack";
    if(replace) action = "replaceBack";
    if(reload) action = "reloadBack";
    this[action]({
      url: location.href,
      pageid: "#"+ pageid,
      id: this.getCurrentStateID(),
      animation: !noAnimation
    });

    //remove all forward page
    var forward = JSON.parse(this.state.getItem("forward") || "[]");
    for(var i=0;i<forward.length;i++) {
      this.removePage(forward[i].pageid);
    }
    this.state.setItem("forward", "[]");  //clearforward

    var duplicatePage = $("#"+$(page)[0].id);

    page.insertBefore($(".page")[0]);

    if(duplicatePage[0] !== page[0]) duplicatePage.remove(); //if inline mod, the duplicate page is current page

    if(extra) this.extras[page[0].id] = extra.appendTo(document.body);

    var id = this.genStateID();
    this.setCurrentStateID(id);

    this[replace || reload ? "replaceState" : "pushState"](url, id);

    this.forwardStack  = [];  //clear forward stack

    this.animatePages(this.getCurrentPage(), page, null, noAnimation);
  }

  Router.prototype.animatePages = function (leftPage, rightPage, leftToRight, noTransition) {
    var removeClasses = 'page-left page-right page-from-center-to-left page-from-center-to-right page-from-right-to-center page-from-left-to-center';
    if(noTransition) {
      if (!leftToRight) {
        rightPage.trigger("pageAnimationStart", [rightPage[0].id, rightPage]);
        leftPage.removeClass(removeClasses).removeClass('page-current');
        rightPage.removeClass(removeClasses).addClass("page-current");
        rightPage.trigger("pageInitInternal", [rightPage[0].id, rightPage]);

        if(rightPage.hasClass("no-tabbar")) {
          $(document.body).addClass("tabbar-hidden");
        } else {
          $(document.body).removeClass("tabbar-hidden");
        }
      } else {
        leftPage.trigger("pageAnimationStart", [rightPage[0].id, rightPage]);
        rightPage.removeClass(removeClasses).removeClass('page-current');
        leftPage.removeClass(removeClasses).addClass("page-current");

        if(leftPage.hasClass("no-tabbar")) {
          $(document.body).addClass("tabbar-hidden");
        } else {
          $(document.body).removeClass("tabbar-hidden");
        }
        rightPage.trigger("pageInitInternal", [leftPage[0].id, leftPage]);
      }
    } else {
      if (!leftToRight) {
        rightPage.trigger("pageAnimationStart", [rightPage[0].id, rightPage]);
        leftPage.removeClass(removeClasses).addClass("page-from-center-to-left").removeClass('page-current');
        rightPage.removeClass(removeClasses).addClass("page-from-right-to-center page-current");

        leftPage.animationEnd(function() {
          leftPage.removeClass(removeClasses);
        });
        rightPage.animationEnd(function() {
          afterAnimation(rightPage);
        });

        if(rightPage.hasClass("no-tabbar")) {
          $(document.body).addClass("tabbar-hidden");
        } else {
          $(document.body).removeClass("tabbar-hidden");
        }
        rightPage.trigger("pageInitInternal", [rightPage[0].id, rightPage]);
      } else {
        leftPage.trigger("pageAnimationStart", [rightPage[0].id, rightPage]);
        rightPage.removeClass(removeClasses).addClass("page-from-center-to-right").removeClass('page-current');
        leftPage.removeClass(removeClasses).addClass("page-from-left-to-center page-current");

        leftPage.animationEnd(function() {
          afterAnimation(leftPage);
        });
        rightPage.animationEnd(function() {
          rightPage.removeClass(removeClasses);
        });
        if(leftPage.hasClass("no-tabbar")) {
          $(document.body).addClass("tabbar-hidden");
        } else {
          $(document.body).removeClass("tabbar-hidden");
        }
        rightPage.trigger("pageInitInternal", [leftPage[0].id, leftPage]);
      }
    }

    function afterAnimation(page) {
      page.removeClass(removeClasses);
      page.trigger("pageAnimationEnd", [page[0].id, page]);
    }

  }
  Router.prototype.getCurrentPage = function () {
    return $(".page-current");
  }
  //如果无法前进，则加载对应的url
  Router.prototype.forward = function(url) {
    var stack = JSON.parse(this.stack.getItem("forward"));
    if(stack.length) {
      history.forward();
    } else {
      location.href = url;
    }
  }
  //如果无法后退，则加载对应的url
  Router.prototype.back = function(url) {
    var stack = JSON.parse(this.stack.getItem("back"));
    if(stack.length) {
      // 如果还遇到点返回后页面没切换过来的问题，可以试试对比 history.back() 前后 currentPage 是否有变化，如果没变化则强制跳转到 url。
      history.back();
    } else if(url) {
      location.href = url;
    } else {
      history.back();
    }
  }

  //后退
  Router.prototype._back = function() {
    var h = this.popBack();
    if(!h) return;
    var currentPage = this.getCurrentPage();
    var newPage = $(h.pageid);
    if(!newPage[0]) return;
    this.pushForward({url: location.href, pageid: "#"+currentPage[0].id, id: this.getCurrentStateID(), animation: h.animation});
    this.setCurrentStateID(h.id);
    this.animatePages(newPage, currentPage, true, !h.animation);
  }

  //前进
  Router.prototype._forward = function() {
    var h = this.popForward();
    if(!h) return;
    var currentPage = this.getCurrentPage();
    var newPage = $(h.pageid);
    if(!newPage[0]) return;
    this.pushBack({url: location.href, pageid: "#"+currentPage[0].id, id: this.getCurrentStateID(), animation: h.animation});
    this.setCurrentStateID(h.id);
    this.animatePages(currentPage, newPage, false, !h.animation);
  }

  Router.prototype.pushState = function(url, id) {
    history.pushState({url: url, id: id}, '', url);
  }

  Router.prototype.replaceState = function(url, id) {
    history.replaceState({url: url, id: id}, '', url);
  }

  Router.prototype.onpopstate = function(d) {
    var state = d.state;
    if(!state) {
      return true;
    }

    if(state.id === this.getCurrentStateID()) {
      return false;
    }
    var forward = state.id > this.getCurrentStateID();
    if(forward) this._forward();
    else this._back();
  }


  //根据url获取页面的DOM，如果是一个内联页面，则直接返回，否则用ajax加载
  Router.prototype.getPage = function(url, callback) {
    if(url[0] === "#") return callback.apply(this, [$(url)]);

    this.dispatch("pageLoadStart");

    if(this.xhr && this.xhr.readyState < 4) {
      this.xhr.onreadystatechange = $.noop;
      this.xhr.abort();
      this.dispatch("pageLoadCancel");
    }

    var self = this;

    this.xhr = $.ajax({
      url: url,
      success: $.proxy(function(data, s, xhr) {
        var html = this.parseXHR(xhr);
        var $page = html[0];
        var $extra = html[1];
        if (!$page[0].id) {
          $page[0].id = this.genRandomID();
        }
        this.initPage($page[0]);
        $page.data("page-remote", 1);
        callback.apply(this, [$page, $extra]);
      }, this),
      error: function() {
        self.dispatch("pageLoadError");
      },
      complete: function() {
        self.dispatch("pageLoadComplete");
      }
    });
  }

  // 用 ajax 提交 form 表单
  Router.prototype.submitForm = function($form, callback){
    this.dispatch("pageLoadStart");

    if(this.xhr && this.xhr.readyState < 4) {
      this.xhr.onreadystatechange = $.noop;
      this.xhr.abort();
      this.dispatch("pageLoadCancel");
    }

    var self = this;
    this.xhr = $.ajax({
      url: $form.attr("action"),
      type: $form.attr("method"),
      data: $form.serialize(),
      success: $.proxy(function(data, s, xhr) {
        var html = this.parseXHR(xhr);
        var $page = html[0];
        var $extra = html[1];
        if(!$page[0].id) $page[0].id = this.genRandomID();
        $page.data("page-remote", 1);
        callback.apply(this, [$page, $extra]);
      }, this),
      error: function() {
        self.dispatch("pageLoadError");
      },
      complete: function() {
        self.dispatch("pageLoadComplete");
      }
    });
  }

  Router.prototype.parseXHR = function(xhr) {
    var response = xhr.responseText;
    var body = response.match(/<body[^>]*>([\s\S.]*)<\/body>/i);
    var html = body ? body[1] : response;
    html = "<div>"+html+"</div>";
    var tmp = $(html);

    var $extra = tmp.find(".popup, .popover, .panel, .panel-overlay");

    var $page = tmp.find(".page");
    if(!$page[0]) $page = tmp.addClass("page");
    return [$page, $extra];
  }

  Router.prototype.genStateID = function() {
    var id = parseInt(this.state.getItem("stateid")) + 1;
    this.state.setItem("stateid", id);
    return id;
  }
  Router.prototype.getCurrentStateID = function() {
    return parseInt(this.state.getItem("currentStateID"));
  }
  Router.prototype.setCurrentStateID = function(id) {
    this.state.setItem("currentStateID", id);
  }
  Router.prototype.genRandomID = function() {
    return "page-"+(+new Date());
  }

  Router.prototype.popBack = function() {
    var stack = JSON.parse(this.stack.getItem("back"));
    if(!stack.length) return null;
    var h = stack.splice(stack.length-1, 1)[0];
    this.stack.setItem("back", JSON.stringify(stack));
    return h;
  }
  Router.prototype.pushBack = function(h) {
    var stack = JSON.parse(this.stack.getItem("back"));
    stack.push(h);
    this.stack.setItem("back", JSON.stringify(stack));
  }
  Router.prototype.replaceBack = function(h) {
    var stack = JSON.parse(this.stack.getItem("back"));
    var lastBack = stack.pop();
    lastBack && this.removePage(lastBack.pageid);
    stack.push(h);
    this.stack.setItem("back", JSON.stringify(stack));
  }
  Router.prototype.reloadBack = function(h) {
    //do nothing;
    return;
  }
  Router.prototype.popForward = function() {
    var stack = JSON.parse(this.stack.getItem("forward"));
    if(!stack.length) return null;
    var h = stack.splice(stack.length-1, 1)[0];
    this.stack.setItem("forward", JSON.stringify(stack));
    return h;
  }
  Router.prototype.pushForward = function(h) {
    var stack = JSON.parse(this.stack.getItem("forward"));
    stack.push(h);
    this.stack.setItem("forward", JSON.stringify(stack));
  }

  Router.prototype.dispatch = function (event) {
    var e = new CustomEvent(event, {
      bubbles: true,
      cancelable: true
    });

    window.dispatchEvent(e);
  };


  $(function() {
    if(!$.smConfig.router) return;

    var router = $.router = new Router();
    router.defaults = Router.prototype.defaults;

    $(document).on("click", "a", function(e) {
      var $target = $(e.currentTarget);
      if($target.hasClass("external") ||
         $target[0].hasAttribute("external") ||
         $target.hasClass("tab-link") ||
         $target.hasClass("open-popup") ||
         $target.hasClass("open-panel")
        ) return;
      e.preventDefault();
      var url = $target.attr("href");
      if($target.hasClass("back")) {
        router.back(url);
        return;
      }

      if(!url || url === "#" || /javascript:.*;/.test(url)) return;
      router.loadPage(url, $target.hasClass("no-transition") ? true : undefined, $target.hasClass("replace") ? true : undefined);  //undefined is different to false
    });

    $(document).on("submit", "form", function(e){
      var $form = $(this);
      if($form.hasClass("external") ||
         $form[0].hasAttribute("external")
        ) return;

      e.preventDefault();

      router.currentPageParam = {
        url: $form.attr("action"),
        noAnimation: $form.hasClass("no-transition") ? true : undefined,
        replace: $form.hasClass("replace") ? true : undefined,
        reload: false
      };

      router.submitForm($form, router.handlePageResult);
    });
  });
}($);
// jshint ignore: end
