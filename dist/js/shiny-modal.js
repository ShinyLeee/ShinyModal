
(function ($) {
  'use strict'

    // SHINY-MODAL CLASS DEFINITION
    // =============================

  var ShinyModal = function (option, element) {
    if (typeof element === 'string') option.target = '#default-modal'

    this.option = option
    this.$body = $(document.body)
    this.$element = $(element)
    this.isShown = false

    ShinyModal.TRANSITION_DURATION = 600
    ShinyModal.OVERLAY_TRANSITION_DURATION = 350

    ShinyModal.DEFAULTS = {
      offsetTop: 40,
      overlayOpacity: 0.3,
      overlayColor: '#000',
      overlayClick: true,
      keyEsc: true,
      keyboard: true,
      draggable: true,
      template: '<div class="shiny-modal-header inner"><span class="close" data-dismiss="shiny-modal">x</span><h1>{_TITLE_}</h1></div><div class="shiny-modal-body"><div class="contents">{_CONTENTS_}</div></div><div class="shiny-modal-footer inner"></div>',
      callback: function (event) { alert('Confrim Action') }
    }

    var options = $.extend({}, ShinyModal.DEFAULTS, $(this).data(), this.option)

    this.options = options
    this.toggle()
  }

  ShinyModal.prototype.toggle = function () {
    return this.isShown ? this.hide() : this.show()
  }

  ShinyModal.prototype.show = function () {
    var type = this.options['modal-type']
    var target = this.options.target

    var beforeShow = $.Event('show.shiny.modal')
    $(target).trigger(beforeShow)

    this.isShown = true

    if (target === '#default-modal') {
      this.insertModal()

      this.renderType(type)
    } else {
      this.reset()
      target = this.displayModal()[0]
    }

    if (!target) {
      $.ShinyModal({
        'modal-type': 'alert',
        'modal-title': '出错啦',
        'modal-contents': '请检查data-target或href是否输入错误'
      })
      throw Error('Wrong Target')
    } else this.overlay('show')

    var afterShow = $.Event('shown.shiny-modal')
    $(target).trigger(afterShow)
  }

  ShinyModal.prototype.hide = function () {
    var target = this.options.target

    var beforeHide = $.Event('hide.shiny-modal')
    $(target).trigger(beforeHide)

    this.isShown = false

    if (target === '#default-modal') $(target).remove()
    else {
      $(target).removeClass('in').addClass('fade')
      setTimeout(function () {
        $(target).hide()
      }, ShinyModal.TRANSITION_DURATION)
    }
    this.overlay('hide')
    this.reset()

    var afterHide = $.Event('hidden.shiny-modal')
    $(target).trigger(afterHide)
  }

  ShinyModal.prototype.overlay = function (status) {
    switch (status) {
      case 'show':

        var overlay = this.$body
            .append('<div id="shiny-modal-overlay"></div>')
            .find('#shiny-modal-overlay')

        overlay
            .css('background-color', this.options.overlayColor)
            .animate({
              opacity: this.options.overlayOpacity
            }, ShinyModal.OVERLAY_TRANSITION_DURATION)

        overlay.one('click.dismiss.shiny-modal', $.proxy(function (e) {
          if (this.options.overlayClick) this.hide()
        }, this))

        break

      case 'hide':

        overlay = $('#shiny-modal-overlay')

        overlay.animate({
          opacity: 0
        }, ShinyModal.OVERLAY_TRANSITION_DURATION)

        setTimeout(function () {
          overlay.remove()
        }, ShinyModal.OVERLAY_TRANSITION_DURATION)

        break
    }
  }

    // INSERT DEFAULT MODAL TO DOM
    // ===========================

  ShinyModal.prototype.insertModal = function () {
    var node
    var hasDraw = document.getElementById('shiny-modal')

    if (!hasDraw) {
      node = this.$body
            .append('<div id="default-modal" class="shiny-modal default"></div>')
    }

    node = $('#default-modal')

    node.html(this.render(this.options.template, {'_TITLE_': this.options['modal-title'] || 'TITLE', '_CONTENTS_': this.options['modal-contents'] || ''}))

    this.addEscBehaviour()
    this.adjustModal()
    this.resize()

    node.one('click.dismiss.shiny-modal', $.proxy(function (e) {
      this.hide()
    }, this))

    return node
  }

    // RENDER MODAL-TYPE
    // ===========================

  ShinyModal.prototype.renderType = function (type) {
    var that = this

    var $buttonHolder = $('.shiny-modal-footer.inner')
    var $iconHolder = $('.shiny-modal-header.inner')

    switch (type) {
      case 'alert':

        var alertIcon = new Element(null, 'iconfont icon-tishi')
        $iconHolder.prepend(alertIcon)

        var closeButton = new Element('Close', 'btn primary', function (e) {
          e.preventDefault()
          that.hide()
        })
        $buttonHolder.prepend(closeButton)

        break

      case 'confirm':

        var confirmIcon = new Element(null, 'iconfont icon-bangzhu')
        $iconHolder.prepend(confirmIcon)

        var cancelButton = new Element('Cancel', 'btn secondary', function (e) {
          e.preventDefault()
          that.hide()
        })
        $buttonHolder.prepend(cancelButton)

        var confirmButton = new Element('Confirm', 'btn primary', $.proxy(function (e) {
          e.preventDefault()
          this.options.callback(e)
        }, this))
        $buttonHolder.prepend(confirmButton)

        break
    }

    function Element (title, classe, clickEvent) {
      var a = document.createElement('a')

      if (title) {
        a.setAttribute('title', title)
        a.text = title
      }

      a.setAttribute('class', classe)
      a.addEventListener('click', clickEvent)

      return a
    }
  }

  ShinyModal.prototype.displayModal = function () {
    var $target = $(this.options.target)

    $target
        .show()
        .removeClass('fade')
        .addClass('in')

    this.addEscBehaviour()
    this.adjustModal()
    this.resize()

    $target.one('click.dismiss.shiny-modal', '[data-dismiss="shiny-modal"]', $.proxy(function (e) {
      e.preventDefault()
      this.hide()
    }, this))

    return $target
  }

  ShinyModal.prototype.addEscBehaviour = function () {
    if (this.isShown && this.options.keyEsc && this.options.keyboard) {
      $(window).one('keyup.dismiss.shiny-modal', $.proxy(function (e) {
        e.which === 27 && this.hide()
      }, this))
    } else $(window).off('keyup.dismiss.shiny-modal')
  }

  ShinyModal.prototype.resize = function () {
    if (this.isShown) {
      $(window).on('resize.shiny-modal', $.proxy(function (e) {
        this.adjustModal()
      }, this))
    } else $(window).off('resize.shiny-modal')
  }

  ShinyModal.prototype.reset = function () {
    var scrollWidth = document.body.scrollWidth
    var modalWidth = this.$element.width()

    this.$element.css({
      left: (scrollWidth - modalWidth) / 2,
      top: 0
    })
  }

  ShinyModal.prototype.adjustModal = function () {
    var top = this.options.offsetTop
    var scrollWidth = document.body.scrollWidth
    var $target = $(this.option.target)
    var modalWidth = $target.width()

    $target.css({
      left: (scrollWidth - modalWidth) / 2,
      top: top
    })
  }

    // TEMPLATE RENDER
    // ===========================

  ShinyModal.prototype.render = function (str, data) {
    for (var p in data) str = str.replace(new RegExp('{' + p + '}', 'g'), data[p])
    return str
  }

  function Plugin (option, _trigger) {
    var $this = $(this)
    var SM = $this.data('shiny-modal')
    var data = SM ? 'toggle' : SM

    if (!option) option = {}

    if (!option.target) option.target = '#' + $this.attr('id')
    var options = $.extend({}, ShinyModal.DEFAULTS, option)

    if (!SM) $this.data('shiny-modal', new ShinyModal(options, this))

    if (typeof data === 'string') {
      options = $.extend({}, ShinyModal.DEFAULTS, option)
      SM[data](options)
    }
  }

  $.fn.ShinyModal = Plugin
  $.fn.ShinyModal.Constructor = ShinyModal

  $.extend({
    ShinyModal: function (option, element) {
      return new ShinyModal(option, '#default-modal')
    }
  })

  $(document).on('click.shiny-modal.data-api', '[data-toggle="shiny-modal"]', function (e) {
    var $this = $(this)
    var $target = $($this.attr('data-target') || $this.attr('href'))
    var option = $this.data('target') ? $this.data() : $.extend({}, $this.data(), {target: $this.attr('href')})

    if ($this.is('a')) e.preventDefault()

    Plugin.call($target, option, this)
  })
}(jQuery))

