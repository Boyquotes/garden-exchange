(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendors~app"],{

/***/ "./node_modules/bootstrap-sass/assets/javascripts/bootstrap/alert.js":
/*!***************************************************************************!*\
  !*** ./node_modules/bootstrap-sass/assets/javascripts/bootstrap/alert.js ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(jQuery) {/* ========================================================================
 * Bootstrap: alert.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.VERSION = '3.4.1'

  Alert.TRANSITION_DURATION = 150

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    selector    = selector === '#' ? [] : selector
    var $parent = $(document).find(selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.closest('.alert')
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      // detach from parent, fire event then clean up data
      $parent.detach().trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one('bsTransitionEnd', removeElement)
        .emulateTransitionEnd(Alert.TRANSITION_DURATION) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.alert

  $.fn.alert             = Plugin
  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js")))

/***/ }),

/***/ "./node_modules/bootstrap-sass/assets/javascripts/bootstrap/collapse.js":
/*!******************************************************************************!*\
  !*** ./node_modules/bootstrap-sass/assets/javascripts/bootstrap/collapse.js ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(jQuery) {/* ========================================================================
 * Bootstrap: collapse.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

/* jshint latedef: false */

+function ($) {
  'use strict';

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.$trigger      = $('[data-toggle="collapse"][href="#' + element.id + '"],' +
                           '[data-toggle="collapse"][data-target="#' + element.id + '"]')
    this.transitioning = null

    if (this.options.parent) {
      this.$parent = this.getParent()
    } else {
      this.addAriaAndCollapsedClass(this.$element, this.$trigger)
    }

    if (this.options.toggle) this.toggle()
  }

  Collapse.VERSION  = '3.4.1'

  Collapse.TRANSITION_DURATION = 350

  Collapse.DEFAULTS = {
    toggle: true
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var activesData
    var actives = this.$parent && this.$parent.children('.panel').children('.in, .collapsing')

    if (actives && actives.length) {
      activesData = actives.data('bs.collapse')
      if (activesData && activesData.transitioning) return
    }

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    if (actives && actives.length) {
      Plugin.call(actives, 'hide')
      activesData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')[dimension](0)
      .attr('aria-expanded', true)

    this.$trigger
      .removeClass('collapsed')
      .attr('aria-expanded', true)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('collapse in')[dimension]('')
      this.transitioning = 0
      this.$element
        .trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element[dimension](this.$element[dimension]())[0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse in')
      .attr('aria-expanded', false)

    this.$trigger
      .addClass('collapsed')
      .attr('aria-expanded', false)

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .removeClass('collapsing')
        .addClass('collapse')
        .trigger('hidden.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }

  Collapse.prototype.getParent = function () {
    return $(document).find(this.options.parent)
      .find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]')
      .each($.proxy(function (i, element) {
        var $element = $(element)
        this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element)
      }, this))
      .end()
  }

  Collapse.prototype.addAriaAndCollapsedClass = function ($element, $trigger) {
    var isOpen = $element.hasClass('in')

    $element.attr('aria-expanded', isOpen)
    $trigger
      .toggleClass('collapsed', !isOpen)
      .attr('aria-expanded', isOpen)
  }

  function getTargetFromTrigger($trigger) {
    var href
    var target = $trigger.attr('data-target')
      || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') // strip for ie7

    return $(document).find(target)
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data && options.toggle && /show|hide/.test(option)) options.toggle = false
      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.collapse

  $.fn.collapse             = Plugin
  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
    var $this   = $(this)

    if (!$this.attr('data-target')) e.preventDefault()

    var $target = getTargetFromTrigger($this)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $this.data()

    Plugin.call($target, option)
  })

}(jQuery);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js")))

/***/ }),

/***/ "./node_modules/bootstrap-sass/assets/javascripts/bootstrap/dropdown.js":
/*!******************************************************************************!*\
  !*** ./node_modules/bootstrap-sass/assets/javascripts/bootstrap/dropdown.js ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(jQuery) {/* ========================================================================
 * Bootstrap: dropdown.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle="dropdown"]'
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.VERSION = '3.4.1'

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = selector !== '#' ? $(document).find(selector) : null

    return $parent && $parent.length ? $parent : $this.parent()
  }

  function clearMenus(e) {
    if (e && e.which === 3) return
    $(backdrop).remove()
    $(toggle).each(function () {
      var $this         = $(this)
      var $parent       = getParent($this)
      var relatedTarget = { relatedTarget: this }

      if (!$parent.hasClass('open')) return

      if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return

      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this.attr('aria-expanded', 'false')
      $parent.removeClass('open').trigger($.Event('hidden.bs.dropdown', relatedTarget))
    })
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $(document.createElement('div'))
          .addClass('dropdown-backdrop')
          .insertAfter($(this))
          .on('click', clearMenus)
      }

      var relatedTarget = { relatedTarget: this }
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this
        .trigger('focus')
        .attr('aria-expanded', 'true')

      $parent
        .toggleClass('open')
        .trigger($.Event('shown.bs.dropdown', relatedTarget))
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive && e.which != 27 || isActive && e.which == 27) {
      if (e.which == 27) $parent.find(toggle).trigger('focus')
      return $this.trigger('click')
    }

    var desc = ' li:not(.disabled):visible a'
    var $items = $parent.find('.dropdown-menu' + desc)

    if (!$items.length) return

    var index = $items.index(e.target)

    if (e.which == 38 && index > 0)                 index--         // up
    if (e.which == 40 && index < $items.length - 1) index++         // down
    if (!~index)                                    index = 0

    $items.eq(index).trigger('focus')
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.dropdown')

      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.dropdown

  $.fn.dropdown             = Plugin
  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown)
    .on('keydown.bs.dropdown.data-api', '.dropdown-menu', Dropdown.prototype.keydown)

}(jQuery);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js")))

/***/ }),

/***/ "./node_modules/bootstrap-sass/assets/javascripts/bootstrap/modal.js":
/*!***************************************************************************!*\
  !*** ./node_modules/bootstrap-sass/assets/javascripts/bootstrap/modal.js ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(jQuery) {/* ========================================================================
 * Bootstrap: modal.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#modals
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options = options
    this.$body = $(document.body)
    this.$element = $(element)
    this.$dialog = this.$element.find('.modal-dialog')
    this.$backdrop = null
    this.isShown = null
    this.originalBodyPad = null
    this.scrollbarWidth = 0
    this.ignoreBackdropClick = false
    this.fixedContent = '.navbar-fixed-top, .navbar-fixed-bottom'

    if (this.options.remote) {
      this.$element
        .find('.modal-content')
        .load(this.options.remote, $.proxy(function () {
          this.$element.trigger('loaded.bs.modal')
        }, this))
    }
  }

  Modal.VERSION = '3.4.1'

  Modal.TRANSITION_DURATION = 300
  Modal.BACKDROP_TRANSITION_DURATION = 150

  Modal.DEFAULTS = {
    backdrop: true,
    keyboard: true,
    show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this.isShown ? this.hide() : this.show(_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.checkScrollbar()
    this.setScrollbar()
    this.$body.addClass('modal-open')

    this.escape()
    this.resize()

    this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.$dialog.on('mousedown.dismiss.bs.modal', function () {
      that.$element.one('mouseup.dismiss.bs.modal', function (e) {
        if ($(e.target).is(that.$element)) that.ignoreBackdropClick = true
      })
    })

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(that.$body) // don't move modals dom position
      }

      that.$element
        .show()
        .scrollTop(0)

      that.adjustDialog()

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element.addClass('in')

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$dialog // wait for modal to slide in
          .one('bsTransitionEnd', function () {
            that.$element.trigger('focus').trigger(e)
          })
          .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
        that.$element.trigger('focus').trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()
    this.resize()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .off('click.dismiss.bs.modal')
      .off('mouseup.dismiss.bs.modal')

    this.$dialog.off('mousedown.dismiss.bs.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one('bsTransitionEnd', $.proxy(this.hideModal, this))
        .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (document !== e.target &&
          this.$element[0] !== e.target &&
          !this.$element.has(e.target).length) {
          this.$element.trigger('focus')
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keydown.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keydown.dismiss.bs.modal')
    }
  }

  Modal.prototype.resize = function () {
    if (this.isShown) {
      $(window).on('resize.bs.modal', $.proxy(this.handleUpdate, this))
    } else {
      $(window).off('resize.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.$body.removeClass('modal-open')
      that.resetAdjustments()
      that.resetScrollbar()
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $(document.createElement('div'))
        .addClass('modal-backdrop ' + animate)
        .appendTo(this.$body)

      this.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {
        if (this.ignoreBackdropClick) {
          this.ignoreBackdropClick = false
          return
        }
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.$element[0].focus()
          : this.hide()
      }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one('bsTransitionEnd', callback)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      var callbackRemove = function () {
        that.removeBackdrop()
        callback && callback()
      }
      $.support.transition && this.$element.hasClass('fade') ?
        this.$backdrop
          .one('bsTransitionEnd', callbackRemove)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callbackRemove()

    } else if (callback) {
      callback()
    }
  }

  // these following methods are used to handle overflowing modals

  Modal.prototype.handleUpdate = function () {
    this.adjustDialog()
  }

  Modal.prototype.adjustDialog = function () {
    var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight

    this.$element.css({
      paddingLeft: !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
      paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
    })
  }

  Modal.prototype.resetAdjustments = function () {
    this.$element.css({
      paddingLeft: '',
      paddingRight: ''
    })
  }

  Modal.prototype.checkScrollbar = function () {
    var fullWindowWidth = window.innerWidth
    if (!fullWindowWidth) { // workaround for missing window.innerWidth in IE8
      var documentElementRect = document.documentElement.getBoundingClientRect()
      fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left)
    }
    this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth
    this.scrollbarWidth = this.measureScrollbar()
  }

  Modal.prototype.setScrollbar = function () {
    var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10)
    this.originalBodyPad = document.body.style.paddingRight || ''
    var scrollbarWidth = this.scrollbarWidth
    if (this.bodyIsOverflowing) {
      this.$body.css('padding-right', bodyPad + scrollbarWidth)
      $(this.fixedContent).each(function (index, element) {
        var actualPadding = element.style.paddingRight
        var calculatedPadding = $(element).css('padding-right')
        $(element)
          .data('padding-right', actualPadding)
          .css('padding-right', parseFloat(calculatedPadding) + scrollbarWidth + 'px')
      })
    }
  }

  Modal.prototype.resetScrollbar = function () {
    this.$body.css('padding-right', this.originalBodyPad)
    $(this.fixedContent).each(function (index, element) {
      var padding = $(element).data('padding-right')
      $(element).removeData('padding-right')
      element.style.paddingRight = padding ? padding : ''
    })
  }

  Modal.prototype.measureScrollbar = function () { // thx walsh
    var scrollDiv = document.createElement('div')
    scrollDiv.className = 'modal-scrollbar-measure'
    this.$body.append(scrollDiv)
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
    this.$body[0].removeChild(scrollDiv)
    return scrollbarWidth
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  function Plugin(option, _relatedTarget) {
    return this.each(function () {
      var $this = $(this)
      var data = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  var old = $.fn.modal

  $.fn.modal = Plugin
  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this = $(this)
    var href = $this.attr('href')
    var target = $this.attr('data-target') ||
      (href && href.replace(/.*(?=#[^\s]+$)/, '')) // strip for ie7

    var $target = $(document).find(target)
    var option = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    if ($this.is('a')) e.preventDefault()

    $target.one('show.bs.modal', function (showEvent) {
      if (showEvent.isDefaultPrevented()) return // only register focus restorer if modal will actually get shown
      $target.one('hidden.bs.modal', function () {
        $this.is(':visible') && $this.trigger('focus')
      })
    })
    Plugin.call($target, option, this)
  })

}(jQuery);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js")))

/***/ }),

/***/ "./node_modules/bootstrap-sass/assets/javascripts/bootstrap/transition.js":
/*!********************************************************************************!*\
  !*** ./node_modules/bootstrap-sass/assets/javascripts/bootstrap/transition.js ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(jQuery) {/* ========================================================================
 * Bootstrap: transition.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: https://modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      WebkitTransition : 'webkitTransitionEnd',
      MozTransition    : 'transitionend',
      OTransition      : 'oTransitionEnd otransitionend',
      transition       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }

    return false // explicit for ie8 (  ._.)
  }

  // https://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false
    var $el = this
    $(this).one('bsTransitionEnd', function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()

    if (!$.support.transition) return

    $.event.special.bsTransitionEnd = {
      bindType: $.support.transition.end,
      delegateType: $.support.transition.end,
      handle: function (e) {
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
      }
    }
  })

}(jQuery);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js")))

/***/ }),

/***/ "./node_modules/core-js/internals/an-instance.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/an-instance.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function (it, Constructor, name) {
  if (!(it instanceof Constructor)) {
    throw TypeError('Incorrect ' + (name ? name + ' ' : '') + 'invocation');
  } return it;
};


/***/ }),

/***/ "./node_modules/core-js/internals/array-buffer-native.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js/internals/array-buffer-native.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = typeof ArrayBuffer !== 'undefined' && typeof DataView !== 'undefined';


/***/ }),

/***/ "./node_modules/core-js/internals/array-buffer-view-core.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js/internals/array-buffer-view-core.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var NATIVE_ARRAY_BUFFER = __webpack_require__(/*! ../internals/array-buffer-native */ "./node_modules/core-js/internals/array-buffer-native.js");
var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");
var has = __webpack_require__(/*! ../internals/has */ "./node_modules/core-js/internals/has.js");
var classof = __webpack_require__(/*! ../internals/classof */ "./node_modules/core-js/internals/classof.js");
var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "./node_modules/core-js/internals/create-non-enumerable-property.js");
var redefine = __webpack_require__(/*! ../internals/redefine */ "./node_modules/core-js/internals/redefine.js");
var defineProperty = __webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js").f;
var getPrototypeOf = __webpack_require__(/*! ../internals/object-get-prototype-of */ "./node_modules/core-js/internals/object-get-prototype-of.js");
var setPrototypeOf = __webpack_require__(/*! ../internals/object-set-prototype-of */ "./node_modules/core-js/internals/object-set-prototype-of.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");
var uid = __webpack_require__(/*! ../internals/uid */ "./node_modules/core-js/internals/uid.js");

var Int8Array = global.Int8Array;
var Int8ArrayPrototype = Int8Array && Int8Array.prototype;
var Uint8ClampedArray = global.Uint8ClampedArray;
var Uint8ClampedArrayPrototype = Uint8ClampedArray && Uint8ClampedArray.prototype;
var TypedArray = Int8Array && getPrototypeOf(Int8Array);
var TypedArrayPrototype = Int8ArrayPrototype && getPrototypeOf(Int8ArrayPrototype);
var ObjectPrototype = Object.prototype;
var isPrototypeOf = ObjectPrototype.isPrototypeOf;

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var TYPED_ARRAY_TAG = uid('TYPED_ARRAY_TAG');
// Fixing native typed arrays in Opera Presto crashes the browser, see #595
var NATIVE_ARRAY_BUFFER_VIEWS = NATIVE_ARRAY_BUFFER && !!setPrototypeOf && classof(global.opera) !== 'Opera';
var TYPED_ARRAY_TAG_REQIRED = false;
var NAME;

var TypedArrayConstructorsList = {
  Int8Array: 1,
  Uint8Array: 1,
  Uint8ClampedArray: 1,
  Int16Array: 2,
  Uint16Array: 2,
  Int32Array: 4,
  Uint32Array: 4,
  Float32Array: 4,
  Float64Array: 8
};

var isView = function isView(it) {
  var klass = classof(it);
  return klass === 'DataView' || has(TypedArrayConstructorsList, klass);
};

var isTypedArray = function (it) {
  return isObject(it) && has(TypedArrayConstructorsList, classof(it));
};

var aTypedArray = function (it) {
  if (isTypedArray(it)) return it;
  throw TypeError('Target is not a typed array');
};

var aTypedArrayConstructor = function (C) {
  if (setPrototypeOf) {
    if (isPrototypeOf.call(TypedArray, C)) return C;
  } else for (var ARRAY in TypedArrayConstructorsList) if (has(TypedArrayConstructorsList, NAME)) {
    var TypedArrayConstructor = global[ARRAY];
    if (TypedArrayConstructor && (C === TypedArrayConstructor || isPrototypeOf.call(TypedArrayConstructor, C))) {
      return C;
    }
  } throw TypeError('Target is not a typed array constructor');
};

var exportTypedArrayMethod = function (KEY, property, forced) {
  if (!DESCRIPTORS) return;
  if (forced) for (var ARRAY in TypedArrayConstructorsList) {
    var TypedArrayConstructor = global[ARRAY];
    if (TypedArrayConstructor && has(TypedArrayConstructor.prototype, KEY)) {
      delete TypedArrayConstructor.prototype[KEY];
    }
  }
  if (!TypedArrayPrototype[KEY] || forced) {
    redefine(TypedArrayPrototype, KEY, forced ? property
      : NATIVE_ARRAY_BUFFER_VIEWS && Int8ArrayPrototype[KEY] || property);
  }
};

var exportTypedArrayStaticMethod = function (KEY, property, forced) {
  var ARRAY, TypedArrayConstructor;
  if (!DESCRIPTORS) return;
  if (setPrototypeOf) {
    if (forced) for (ARRAY in TypedArrayConstructorsList) {
      TypedArrayConstructor = global[ARRAY];
      if (TypedArrayConstructor && has(TypedArrayConstructor, KEY)) {
        delete TypedArrayConstructor[KEY];
      }
    }
    if (!TypedArray[KEY] || forced) {
      // V8 ~ Chrome 49-50 `%TypedArray%` methods are non-writable non-configurable
      try {
        return redefine(TypedArray, KEY, forced ? property : NATIVE_ARRAY_BUFFER_VIEWS && Int8Array[KEY] || property);
      } catch (error) { /* empty */ }
    } else return;
  }
  for (ARRAY in TypedArrayConstructorsList) {
    TypedArrayConstructor = global[ARRAY];
    if (TypedArrayConstructor && (!TypedArrayConstructor[KEY] || forced)) {
      redefine(TypedArrayConstructor, KEY, property);
    }
  }
};

for (NAME in TypedArrayConstructorsList) {
  if (!global[NAME]) NATIVE_ARRAY_BUFFER_VIEWS = false;
}

// WebKit bug - typed arrays constructors prototype is Object.prototype
if (!NATIVE_ARRAY_BUFFER_VIEWS || typeof TypedArray != 'function' || TypedArray === Function.prototype) {
  // eslint-disable-next-line no-shadow
  TypedArray = function TypedArray() {
    throw TypeError('Incorrect invocation');
  };
  if (NATIVE_ARRAY_BUFFER_VIEWS) for (NAME in TypedArrayConstructorsList) {
    if (global[NAME]) setPrototypeOf(global[NAME], TypedArray);
  }
}

if (!NATIVE_ARRAY_BUFFER_VIEWS || !TypedArrayPrototype || TypedArrayPrototype === ObjectPrototype) {
  TypedArrayPrototype = TypedArray.prototype;
  if (NATIVE_ARRAY_BUFFER_VIEWS) for (NAME in TypedArrayConstructorsList) {
    if (global[NAME]) setPrototypeOf(global[NAME].prototype, TypedArrayPrototype);
  }
}

// WebKit bug - one more object in Uint8ClampedArray prototype chain
if (NATIVE_ARRAY_BUFFER_VIEWS && getPrototypeOf(Uint8ClampedArrayPrototype) !== TypedArrayPrototype) {
  setPrototypeOf(Uint8ClampedArrayPrototype, TypedArrayPrototype);
}

if (DESCRIPTORS && !has(TypedArrayPrototype, TO_STRING_TAG)) {
  TYPED_ARRAY_TAG_REQIRED = true;
  defineProperty(TypedArrayPrototype, TO_STRING_TAG, { get: function () {
    return isObject(this) ? this[TYPED_ARRAY_TAG] : undefined;
  } });
  for (NAME in TypedArrayConstructorsList) if (global[NAME]) {
    createNonEnumerableProperty(global[NAME], TYPED_ARRAY_TAG, NAME);
  }
}

module.exports = {
  NATIVE_ARRAY_BUFFER_VIEWS: NATIVE_ARRAY_BUFFER_VIEWS,
  TYPED_ARRAY_TAG: TYPED_ARRAY_TAG_REQIRED && TYPED_ARRAY_TAG,
  aTypedArray: aTypedArray,
  aTypedArrayConstructor: aTypedArrayConstructor,
  exportTypedArrayMethod: exportTypedArrayMethod,
  exportTypedArrayStaticMethod: exportTypedArrayStaticMethod,
  isView: isView,
  isTypedArray: isTypedArray,
  TypedArray: TypedArray,
  TypedArrayPrototype: TypedArrayPrototype
};


/***/ }),

/***/ "./node_modules/core-js/internals/array-buffer.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/internals/array-buffer.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var NATIVE_ARRAY_BUFFER = __webpack_require__(/*! ../internals/array-buffer-native */ "./node_modules/core-js/internals/array-buffer-native.js");
var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "./node_modules/core-js/internals/create-non-enumerable-property.js");
var redefineAll = __webpack_require__(/*! ../internals/redefine-all */ "./node_modules/core-js/internals/redefine-all.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var anInstance = __webpack_require__(/*! ../internals/an-instance */ "./node_modules/core-js/internals/an-instance.js");
var toInteger = __webpack_require__(/*! ../internals/to-integer */ "./node_modules/core-js/internals/to-integer.js");
var toLength = __webpack_require__(/*! ../internals/to-length */ "./node_modules/core-js/internals/to-length.js");
var toIndex = __webpack_require__(/*! ../internals/to-index */ "./node_modules/core-js/internals/to-index.js");
var IEEE754 = __webpack_require__(/*! ../internals/ieee754 */ "./node_modules/core-js/internals/ieee754.js");
var getPrototypeOf = __webpack_require__(/*! ../internals/object-get-prototype-of */ "./node_modules/core-js/internals/object-get-prototype-of.js");
var setPrototypeOf = __webpack_require__(/*! ../internals/object-set-prototype-of */ "./node_modules/core-js/internals/object-set-prototype-of.js");
var getOwnPropertyNames = __webpack_require__(/*! ../internals/object-get-own-property-names */ "./node_modules/core-js/internals/object-get-own-property-names.js").f;
var defineProperty = __webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js").f;
var arrayFill = __webpack_require__(/*! ../internals/array-fill */ "./node_modules/core-js/internals/array-fill.js");
var setToStringTag = __webpack_require__(/*! ../internals/set-to-string-tag */ "./node_modules/core-js/internals/set-to-string-tag.js");
var InternalStateModule = __webpack_require__(/*! ../internals/internal-state */ "./node_modules/core-js/internals/internal-state.js");

var getInternalState = InternalStateModule.get;
var setInternalState = InternalStateModule.set;
var ARRAY_BUFFER = 'ArrayBuffer';
var DATA_VIEW = 'DataView';
var PROTOTYPE = 'prototype';
var WRONG_LENGTH = 'Wrong length';
var WRONG_INDEX = 'Wrong index';
var NativeArrayBuffer = global[ARRAY_BUFFER];
var $ArrayBuffer = NativeArrayBuffer;
var $DataView = global[DATA_VIEW];
var $DataViewPrototype = $DataView && $DataView[PROTOTYPE];
var ObjectPrototype = Object.prototype;
var RangeError = global.RangeError;

var packIEEE754 = IEEE754.pack;
var unpackIEEE754 = IEEE754.unpack;

var packInt8 = function (number) {
  return [number & 0xFF];
};

var packInt16 = function (number) {
  return [number & 0xFF, number >> 8 & 0xFF];
};

var packInt32 = function (number) {
  return [number & 0xFF, number >> 8 & 0xFF, number >> 16 & 0xFF, number >> 24 & 0xFF];
};

var unpackInt32 = function (buffer) {
  return buffer[3] << 24 | buffer[2] << 16 | buffer[1] << 8 | buffer[0];
};

var packFloat32 = function (number) {
  return packIEEE754(number, 23, 4);
};

var packFloat64 = function (number) {
  return packIEEE754(number, 52, 8);
};

var addGetter = function (Constructor, key) {
  defineProperty(Constructor[PROTOTYPE], key, { get: function () { return getInternalState(this)[key]; } });
};

var get = function (view, count, index, isLittleEndian) {
  var intIndex = toIndex(index);
  var store = getInternalState(view);
  if (intIndex + count > store.byteLength) throw RangeError(WRONG_INDEX);
  var bytes = getInternalState(store.buffer).bytes;
  var start = intIndex + store.byteOffset;
  var pack = bytes.slice(start, start + count);
  return isLittleEndian ? pack : pack.reverse();
};

var set = function (view, count, index, conversion, value, isLittleEndian) {
  var intIndex = toIndex(index);
  var store = getInternalState(view);
  if (intIndex + count > store.byteLength) throw RangeError(WRONG_INDEX);
  var bytes = getInternalState(store.buffer).bytes;
  var start = intIndex + store.byteOffset;
  var pack = conversion(+value);
  for (var i = 0; i < count; i++) bytes[start + i] = pack[isLittleEndian ? i : count - i - 1];
};

if (!NATIVE_ARRAY_BUFFER) {
  $ArrayBuffer = function ArrayBuffer(length) {
    anInstance(this, $ArrayBuffer, ARRAY_BUFFER);
    var byteLength = toIndex(length);
    setInternalState(this, {
      bytes: arrayFill.call(new Array(byteLength), 0),
      byteLength: byteLength
    });
    if (!DESCRIPTORS) this.byteLength = byteLength;
  };

  $DataView = function DataView(buffer, byteOffset, byteLength) {
    anInstance(this, $DataView, DATA_VIEW);
    anInstance(buffer, $ArrayBuffer, DATA_VIEW);
    var bufferLength = getInternalState(buffer).byteLength;
    var offset = toInteger(byteOffset);
    if (offset < 0 || offset > bufferLength) throw RangeError('Wrong offset');
    byteLength = byteLength === undefined ? bufferLength - offset : toLength(byteLength);
    if (offset + byteLength > bufferLength) throw RangeError(WRONG_LENGTH);
    setInternalState(this, {
      buffer: buffer,
      byteLength: byteLength,
      byteOffset: offset
    });
    if (!DESCRIPTORS) {
      this.buffer = buffer;
      this.byteLength = byteLength;
      this.byteOffset = offset;
    }
  };

  if (DESCRIPTORS) {
    addGetter($ArrayBuffer, 'byteLength');
    addGetter($DataView, 'buffer');
    addGetter($DataView, 'byteLength');
    addGetter($DataView, 'byteOffset');
  }

  redefineAll($DataView[PROTOTYPE], {
    getInt8: function getInt8(byteOffset) {
      return get(this, 1, byteOffset)[0] << 24 >> 24;
    },
    getUint8: function getUint8(byteOffset) {
      return get(this, 1, byteOffset)[0];
    },
    getInt16: function getInt16(byteOffset /* , littleEndian */) {
      var bytes = get(this, 2, byteOffset, arguments.length > 1 ? arguments[1] : undefined);
      return (bytes[1] << 8 | bytes[0]) << 16 >> 16;
    },
    getUint16: function getUint16(byteOffset /* , littleEndian */) {
      var bytes = get(this, 2, byteOffset, arguments.length > 1 ? arguments[1] : undefined);
      return bytes[1] << 8 | bytes[0];
    },
    getInt32: function getInt32(byteOffset /* , littleEndian */) {
      return unpackInt32(get(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined));
    },
    getUint32: function getUint32(byteOffset /* , littleEndian */) {
      return unpackInt32(get(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined)) >>> 0;
    },
    getFloat32: function getFloat32(byteOffset /* , littleEndian */) {
      return unpackIEEE754(get(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined), 23);
    },
    getFloat64: function getFloat64(byteOffset /* , littleEndian */) {
      return unpackIEEE754(get(this, 8, byteOffset, arguments.length > 1 ? arguments[1] : undefined), 52);
    },
    setInt8: function setInt8(byteOffset, value) {
      set(this, 1, byteOffset, packInt8, value);
    },
    setUint8: function setUint8(byteOffset, value) {
      set(this, 1, byteOffset, packInt8, value);
    },
    setInt16: function setInt16(byteOffset, value /* , littleEndian */) {
      set(this, 2, byteOffset, packInt16, value, arguments.length > 2 ? arguments[2] : undefined);
    },
    setUint16: function setUint16(byteOffset, value /* , littleEndian */) {
      set(this, 2, byteOffset, packInt16, value, arguments.length > 2 ? arguments[2] : undefined);
    },
    setInt32: function setInt32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packInt32, value, arguments.length > 2 ? arguments[2] : undefined);
    },
    setUint32: function setUint32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packInt32, value, arguments.length > 2 ? arguments[2] : undefined);
    },
    setFloat32: function setFloat32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packFloat32, value, arguments.length > 2 ? arguments[2] : undefined);
    },
    setFloat64: function setFloat64(byteOffset, value /* , littleEndian */) {
      set(this, 8, byteOffset, packFloat64, value, arguments.length > 2 ? arguments[2] : undefined);
    }
  });
} else {
  if (!fails(function () {
    NativeArrayBuffer(1);
  }) || !fails(function () {
    new NativeArrayBuffer(-1); // eslint-disable-line no-new
  }) || fails(function () {
    new NativeArrayBuffer(); // eslint-disable-line no-new
    new NativeArrayBuffer(1.5); // eslint-disable-line no-new
    new NativeArrayBuffer(NaN); // eslint-disable-line no-new
    return NativeArrayBuffer.name != ARRAY_BUFFER;
  })) {
    $ArrayBuffer = function ArrayBuffer(length) {
      anInstance(this, $ArrayBuffer);
      return new NativeArrayBuffer(toIndex(length));
    };
    var ArrayBufferPrototype = $ArrayBuffer[PROTOTYPE] = NativeArrayBuffer[PROTOTYPE];
    for (var keys = getOwnPropertyNames(NativeArrayBuffer), j = 0, key; keys.length > j;) {
      if (!((key = keys[j++]) in $ArrayBuffer)) {
        createNonEnumerableProperty($ArrayBuffer, key, NativeArrayBuffer[key]);
      }
    }
    ArrayBufferPrototype.constructor = $ArrayBuffer;
  }

  // WebKit bug - the same parent prototype for typed arrays and data view
  if (setPrototypeOf && getPrototypeOf($DataViewPrototype) !== ObjectPrototype) {
    setPrototypeOf($DataViewPrototype, ObjectPrototype);
  }

  // iOS Safari 7.x bug
  var testView = new $DataView(new $ArrayBuffer(2));
  var nativeSetInt8 = $DataViewPrototype.setInt8;
  testView.setInt8(0, 2147483648);
  testView.setInt8(1, 2147483649);
  if (testView.getInt8(0) || !testView.getInt8(1)) redefineAll($DataViewPrototype, {
    setInt8: function setInt8(byteOffset, value) {
      nativeSetInt8.call(this, byteOffset, value << 24 >> 24);
    },
    setUint8: function setUint8(byteOffset, value) {
      nativeSetInt8.call(this, byteOffset, value << 24 >> 24);
    }
  }, { unsafe: true });
}

setToStringTag($ArrayBuffer, ARRAY_BUFFER);
setToStringTag($DataView, DATA_VIEW);

module.exports = {
  ArrayBuffer: $ArrayBuffer,
  DataView: $DataView
};


/***/ }),

/***/ "./node_modules/core-js/internals/array-copy-within.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/array-copy-within.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js/internals/to-object.js");
var toAbsoluteIndex = __webpack_require__(/*! ../internals/to-absolute-index */ "./node_modules/core-js/internals/to-absolute-index.js");
var toLength = __webpack_require__(/*! ../internals/to-length */ "./node_modules/core-js/internals/to-length.js");

var min = Math.min;

// `Array.prototype.copyWithin` method implementation
// https://tc39.github.io/ecma262/#sec-array.prototype.copywithin
module.exports = [].copyWithin || function copyWithin(target /* = 0 */, start /* = 0, end = @length */) {
  var O = toObject(this);
  var len = toLength(O.length);
  var to = toAbsoluteIndex(target, len);
  var from = toAbsoluteIndex(start, len);
  var end = arguments.length > 2 ? arguments[2] : undefined;
  var count = min((end === undefined ? len : toAbsoluteIndex(end, len)) - from, len - to);
  var inc = 1;
  if (from < to && to < from + count) {
    inc = -1;
    from += count - 1;
    to += count - 1;
  }
  while (count-- > 0) {
    if (from in O) O[to] = O[from];
    else delete O[to];
    to += inc;
    from += inc;
  } return O;
};


/***/ }),

/***/ "./node_modules/core-js/internals/array-fill.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/internals/array-fill.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js/internals/to-object.js");
var toAbsoluteIndex = __webpack_require__(/*! ../internals/to-absolute-index */ "./node_modules/core-js/internals/to-absolute-index.js");
var toLength = __webpack_require__(/*! ../internals/to-length */ "./node_modules/core-js/internals/to-length.js");

// `Array.prototype.fill` method implementation
// https://tc39.github.io/ecma262/#sec-array.prototype.fill
module.exports = function fill(value /* , start = 0, end = @length */) {
  var O = toObject(this);
  var length = toLength(O.length);
  var argumentsLength = arguments.length;
  var index = toAbsoluteIndex(argumentsLength > 1 ? arguments[1] : undefined, length);
  var end = argumentsLength > 2 ? arguments[2] : undefined;
  var endPos = end === undefined ? length : toAbsoluteIndex(end, length);
  while (endPos > index) O[index++] = value;
  return O;
};


/***/ }),

/***/ "./node_modules/core-js/internals/array-for-each.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/array-for-each.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $forEach = __webpack_require__(/*! ../internals/array-iteration */ "./node_modules/core-js/internals/array-iteration.js").forEach;
var arrayMethodIsStrict = __webpack_require__(/*! ../internals/array-method-is-strict */ "./node_modules/core-js/internals/array-method-is-strict.js");
var arrayMethodUsesToLength = __webpack_require__(/*! ../internals/array-method-uses-to-length */ "./node_modules/core-js/internals/array-method-uses-to-length.js");

var STRICT_METHOD = arrayMethodIsStrict('forEach');
var USES_TO_LENGTH = arrayMethodUsesToLength('forEach');

// `Array.prototype.forEach` method implementation
// https://tc39.github.io/ecma262/#sec-array.prototype.foreach
module.exports = (!STRICT_METHOD || !USES_TO_LENGTH) ? function forEach(callbackfn /* , thisArg */) {
  return $forEach(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
} : [].forEach;


/***/ }),

/***/ "./node_modules/core-js/internals/array-from.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/internals/array-from.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var bind = __webpack_require__(/*! ../internals/function-bind-context */ "./node_modules/core-js/internals/function-bind-context.js");
var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js/internals/to-object.js");
var callWithSafeIterationClosing = __webpack_require__(/*! ../internals/call-with-safe-iteration-closing */ "./node_modules/core-js/internals/call-with-safe-iteration-closing.js");
var isArrayIteratorMethod = __webpack_require__(/*! ../internals/is-array-iterator-method */ "./node_modules/core-js/internals/is-array-iterator-method.js");
var toLength = __webpack_require__(/*! ../internals/to-length */ "./node_modules/core-js/internals/to-length.js");
var createProperty = __webpack_require__(/*! ../internals/create-property */ "./node_modules/core-js/internals/create-property.js");
var getIteratorMethod = __webpack_require__(/*! ../internals/get-iterator-method */ "./node_modules/core-js/internals/get-iterator-method.js");

// `Array.from` method implementation
// https://tc39.github.io/ecma262/#sec-array.from
module.exports = function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
  var O = toObject(arrayLike);
  var C = typeof this == 'function' ? this : Array;
  var argumentsLength = arguments.length;
  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
  var mapping = mapfn !== undefined;
  var iteratorMethod = getIteratorMethod(O);
  var index = 0;
  var length, result, step, iterator, next, value;
  if (mapping) mapfn = bind(mapfn, argumentsLength > 2 ? arguments[2] : undefined, 2);
  // if the target is not iterable or it's an array with the default iterator - use a simple case
  if (iteratorMethod != undefined && !(C == Array && isArrayIteratorMethod(iteratorMethod))) {
    iterator = iteratorMethod.call(O);
    next = iterator.next;
    result = new C();
    for (;!(step = next.call(iterator)).done; index++) {
      value = mapping ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index], true) : step.value;
      createProperty(result, index, value);
    }
  } else {
    length = toLength(O.length);
    result = new C(length);
    for (;length > index; index++) {
      value = mapping ? mapfn(O[index], index) : O[index];
      createProperty(result, index, value);
    }
  }
  result.length = index;
  return result;
};


/***/ }),

/***/ "./node_modules/core-js/internals/array-method-has-species-support.js":
/*!****************************************************************************!*\
  !*** ./node_modules/core-js/internals/array-method-has-species-support.js ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");
var V8_VERSION = __webpack_require__(/*! ../internals/engine-v8-version */ "./node_modules/core-js/internals/engine-v8-version.js");

var SPECIES = wellKnownSymbol('species');

module.exports = function (METHOD_NAME) {
  // We can't use this feature detection in V8 since it causes
  // deoptimization and serious performance degradation
  // https://github.com/zloirock/core-js/issues/677
  return V8_VERSION >= 51 || !fails(function () {
    var array = [];
    var constructor = array.constructor = {};
    constructor[SPECIES] = function () {
      return { foo: 1 };
    };
    return array[METHOD_NAME](Boolean).foo !== 1;
  });
};


/***/ }),

/***/ "./node_modules/core-js/internals/array-reduce.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/internals/array-reduce.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var aFunction = __webpack_require__(/*! ../internals/a-function */ "./node_modules/core-js/internals/a-function.js");
var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js/internals/to-object.js");
var IndexedObject = __webpack_require__(/*! ../internals/indexed-object */ "./node_modules/core-js/internals/indexed-object.js");
var toLength = __webpack_require__(/*! ../internals/to-length */ "./node_modules/core-js/internals/to-length.js");

// `Array.prototype.{ reduce, reduceRight }` methods implementation
var createMethod = function (IS_RIGHT) {
  return function (that, callbackfn, argumentsLength, memo) {
    aFunction(callbackfn);
    var O = toObject(that);
    var self = IndexedObject(O);
    var length = toLength(O.length);
    var index = IS_RIGHT ? length - 1 : 0;
    var i = IS_RIGHT ? -1 : 1;
    if (argumentsLength < 2) while (true) {
      if (index in self) {
        memo = self[index];
        index += i;
        break;
      }
      index += i;
      if (IS_RIGHT ? index < 0 : length <= index) {
        throw TypeError('Reduce of empty array with no initial value');
      }
    }
    for (;IS_RIGHT ? index >= 0 : length > index; index += i) if (index in self) {
      memo = callbackfn(memo, self[index], index, O);
    }
    return memo;
  };
};

module.exports = {
  // `Array.prototype.reduce` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.reduce
  left: createMethod(false),
  // `Array.prototype.reduceRight` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.reduceright
  right: createMethod(true)
};


/***/ }),

/***/ "./node_modules/core-js/internals/call-with-safe-iteration-closing.js":
/*!****************************************************************************!*\
  !*** ./node_modules/core-js/internals/call-with-safe-iteration-closing.js ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");

// call something on iterator step with safe closing on error
module.exports = function (iterator, fn, value, ENTRIES) {
  try {
    return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (error) {
    var returnMethod = iterator['return'];
    if (returnMethod !== undefined) anObject(returnMethod.call(iterator));
    throw error;
  }
};


/***/ }),

/***/ "./node_modules/core-js/internals/check-correctness-of-iteration.js":
/*!**************************************************************************!*\
  !*** ./node_modules/core-js/internals/check-correctness-of-iteration.js ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");

var ITERATOR = wellKnownSymbol('iterator');
var SAFE_CLOSING = false;

try {
  var called = 0;
  var iteratorWithReturn = {
    next: function () {
      return { done: !!called++ };
    },
    'return': function () {
      SAFE_CLOSING = true;
    }
  };
  iteratorWithReturn[ITERATOR] = function () {
    return this;
  };
  // eslint-disable-next-line no-throw-literal
  Array.from(iteratorWithReturn, function () { throw 2; });
} catch (error) { /* empty */ }

module.exports = function (exec, SKIP_CLOSING) {
  if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
  var ITERATION_SUPPORT = false;
  try {
    var object = {};
    object[ITERATOR] = function () {
      return {
        next: function () {
          return { done: ITERATION_SUPPORT = true };
        }
      };
    };
    exec(object);
  } catch (error) { /* empty */ }
  return ITERATION_SUPPORT;
};


/***/ }),

/***/ "./node_modules/core-js/internals/create-property.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/internals/create-property.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var toPrimitive = __webpack_require__(/*! ../internals/to-primitive */ "./node_modules/core-js/internals/to-primitive.js");
var definePropertyModule = __webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js");
var createPropertyDescriptor = __webpack_require__(/*! ../internals/create-property-descriptor */ "./node_modules/core-js/internals/create-property-descriptor.js");

module.exports = function (object, key, value) {
  var propertyKey = toPrimitive(key);
  if (propertyKey in object) definePropertyModule.f(object, propertyKey, createPropertyDescriptor(0, value));
  else object[propertyKey] = value;
};


/***/ }),

/***/ "./node_modules/core-js/internals/engine-user-agent.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/engine-user-agent.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js/internals/get-built-in.js");

module.exports = getBuiltIn('navigator', 'userAgent') || '';


/***/ }),

/***/ "./node_modules/core-js/internals/engine-v8-version.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/engine-v8-version.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var userAgent = __webpack_require__(/*! ../internals/engine-user-agent */ "./node_modules/core-js/internals/engine-user-agent.js");

var process = global.process;
var versions = process && process.versions;
var v8 = versions && versions.v8;
var match, version;

if (v8) {
  match = v8.split('.');
  version = match[0] + match[1];
} else if (userAgent) {
  match = userAgent.match(/Edge\/(\d+)/);
  if (!match || match[1] >= 74) {
    match = userAgent.match(/Chrome\/(\d+)/);
    if (match) version = match[1];
  }
}

module.exports = version && +version;


/***/ }),

/***/ "./node_modules/core-js/internals/function-bind.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/function-bind.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var aFunction = __webpack_require__(/*! ../internals/a-function */ "./node_modules/core-js/internals/a-function.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");

var slice = [].slice;
var factories = {};

var construct = function (C, argsLength, args) {
  if (!(argsLength in factories)) {
    for (var list = [], i = 0; i < argsLength; i++) list[i] = 'a[' + i + ']';
    // eslint-disable-next-line no-new-func
    factories[argsLength] = Function('C,a', 'return new C(' + list.join(',') + ')');
  } return factories[argsLength](C, args);
};

// `Function.prototype.bind` method implementation
// https://tc39.github.io/ecma262/#sec-function.prototype.bind
module.exports = Function.bind || function bind(that /* , ...args */) {
  var fn = aFunction(this);
  var partArgs = slice.call(arguments, 1);
  var boundFunction = function bound(/* args... */) {
    var args = partArgs.concat(slice.call(arguments));
    return this instanceof boundFunction ? construct(fn, args.length, args) : fn.apply(that, args);
  };
  if (isObject(fn.prototype)) boundFunction.prototype = fn.prototype;
  return boundFunction;
};


/***/ }),

/***/ "./node_modules/core-js/internals/get-iterator-method.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js/internals/get-iterator-method.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__(/*! ../internals/classof */ "./node_modules/core-js/internals/classof.js");
var Iterators = __webpack_require__(/*! ../internals/iterators */ "./node_modules/core-js/internals/iterators.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");

var ITERATOR = wellKnownSymbol('iterator');

module.exports = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};


/***/ }),

/***/ "./node_modules/core-js/internals/get-iterator.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/internals/get-iterator.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var getIteratorMethod = __webpack_require__(/*! ../internals/get-iterator-method */ "./node_modules/core-js/internals/get-iterator-method.js");

module.exports = function (it) {
  var iteratorMethod = getIteratorMethod(it);
  if (typeof iteratorMethod != 'function') {
    throw TypeError(String(it) + ' is not iterable');
  } return anObject(iteratorMethod.call(it));
};


/***/ }),

/***/ "./node_modules/core-js/internals/ieee754.js":
/*!***************************************************!*\
  !*** ./node_modules/core-js/internals/ieee754.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// IEEE754 conversions based on https://github.com/feross/ieee754
// eslint-disable-next-line no-shadow-restricted-names
var Infinity = 1 / 0;
var abs = Math.abs;
var pow = Math.pow;
var floor = Math.floor;
var log = Math.log;
var LN2 = Math.LN2;

var pack = function (number, mantissaLength, bytes) {
  var buffer = new Array(bytes);
  var exponentLength = bytes * 8 - mantissaLength - 1;
  var eMax = (1 << exponentLength) - 1;
  var eBias = eMax >> 1;
  var rt = mantissaLength === 23 ? pow(2, -24) - pow(2, -77) : 0;
  var sign = number < 0 || number === 0 && 1 / number < 0 ? 1 : 0;
  var index = 0;
  var exponent, mantissa, c;
  number = abs(number);
  // eslint-disable-next-line no-self-compare
  if (number != number || number === Infinity) {
    // eslint-disable-next-line no-self-compare
    mantissa = number != number ? 1 : 0;
    exponent = eMax;
  } else {
    exponent = floor(log(number) / LN2);
    if (number * (c = pow(2, -exponent)) < 1) {
      exponent--;
      c *= 2;
    }
    if (exponent + eBias >= 1) {
      number += rt / c;
    } else {
      number += rt * pow(2, 1 - eBias);
    }
    if (number * c >= 2) {
      exponent++;
      c /= 2;
    }
    if (exponent + eBias >= eMax) {
      mantissa = 0;
      exponent = eMax;
    } else if (exponent + eBias >= 1) {
      mantissa = (number * c - 1) * pow(2, mantissaLength);
      exponent = exponent + eBias;
    } else {
      mantissa = number * pow(2, eBias - 1) * pow(2, mantissaLength);
      exponent = 0;
    }
  }
  for (; mantissaLength >= 8; buffer[index++] = mantissa & 255, mantissa /= 256, mantissaLength -= 8);
  exponent = exponent << mantissaLength | mantissa;
  exponentLength += mantissaLength;
  for (; exponentLength > 0; buffer[index++] = exponent & 255, exponent /= 256, exponentLength -= 8);
  buffer[--index] |= sign * 128;
  return buffer;
};

var unpack = function (buffer, mantissaLength) {
  var bytes = buffer.length;
  var exponentLength = bytes * 8 - mantissaLength - 1;
  var eMax = (1 << exponentLength) - 1;
  var eBias = eMax >> 1;
  var nBits = exponentLength - 7;
  var index = bytes - 1;
  var sign = buffer[index--];
  var exponent = sign & 127;
  var mantissa;
  sign >>= 7;
  for (; nBits > 0; exponent = exponent * 256 + buffer[index], index--, nBits -= 8);
  mantissa = exponent & (1 << -nBits) - 1;
  exponent >>= -nBits;
  nBits += mantissaLength;
  for (; nBits > 0; mantissa = mantissa * 256 + buffer[index], index--, nBits -= 8);
  if (exponent === 0) {
    exponent = 1 - eBias;
  } else if (exponent === eMax) {
    return mantissa ? NaN : sign ? -Infinity : Infinity;
  } else {
    mantissa = mantissa + pow(2, mantissaLength);
    exponent = exponent - eBias;
  } return (sign ? -1 : 1) * mantissa * pow(2, exponent - mantissaLength);
};

module.exports = {
  pack: pack,
  unpack: unpack
};


/***/ }),

/***/ "./node_modules/core-js/internals/inherit-if-required.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js/internals/inherit-if-required.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");
var setPrototypeOf = __webpack_require__(/*! ../internals/object-set-prototype-of */ "./node_modules/core-js/internals/object-set-prototype-of.js");

// makes subclassing work correct for wrapped built-ins
module.exports = function ($this, dummy, Wrapper) {
  var NewTarget, NewTargetPrototype;
  if (
    // it can work only with native `setPrototypeOf`
    setPrototypeOf &&
    // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
    typeof (NewTarget = dummy.constructor) == 'function' &&
    NewTarget !== Wrapper &&
    isObject(NewTargetPrototype = NewTarget.prototype) &&
    NewTargetPrototype !== Wrapper.prototype
  ) setPrototypeOf($this, NewTargetPrototype);
  return $this;
};


/***/ }),

/***/ "./node_modules/core-js/internals/is-array-iterator-method.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/internals/is-array-iterator-method.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");
var Iterators = __webpack_require__(/*! ../internals/iterators */ "./node_modules/core-js/internals/iterators.js");

var ITERATOR = wellKnownSymbol('iterator');
var ArrayPrototype = Array.prototype;

// check on default Array iterator
module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayPrototype[ITERATOR] === it);
};


/***/ }),

/***/ "./node_modules/core-js/internals/native-url.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/internals/native-url.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");
var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "./node_modules/core-js/internals/is-pure.js");

var ITERATOR = wellKnownSymbol('iterator');

module.exports = !fails(function () {
  var url = new URL('b?a=1&b=2&c=3', 'http://a');
  var searchParams = url.searchParams;
  var result = '';
  url.pathname = 'c%20d';
  searchParams.forEach(function (value, key) {
    searchParams['delete']('b');
    result += key + value;
  });
  return (IS_PURE && !url.toJSON)
    || !searchParams.sort
    || url.href !== 'http://a/c%20d?a=1&c=3'
    || searchParams.get('c') !== '3'
    || String(new URLSearchParams('?a=1')) !== 'a=1'
    || !searchParams[ITERATOR]
    // throws in Edge
    || new URL('https://a@b').username !== 'a'
    || new URLSearchParams(new URLSearchParams('a=b')).get('a') !== 'b'
    // not punycoded in Edge
    || new URL('http://тест').host !== 'xn--e1aybc'
    // not escaped in Chrome 62-
    || new URL('http://a#б').hash !== '#%D0%B1'
    // fails in Chrome 66-
    || result !== 'a1c3'
    // throws in Safari
    || new URL('http://x', undefined).host !== 'x';
});


/***/ }),

/***/ "./node_modules/core-js/internals/object-assign.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/object-assign.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var objectKeys = __webpack_require__(/*! ../internals/object-keys */ "./node_modules/core-js/internals/object-keys.js");
var getOwnPropertySymbolsModule = __webpack_require__(/*! ../internals/object-get-own-property-symbols */ "./node_modules/core-js/internals/object-get-own-property-symbols.js");
var propertyIsEnumerableModule = __webpack_require__(/*! ../internals/object-property-is-enumerable */ "./node_modules/core-js/internals/object-property-is-enumerable.js");
var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js/internals/to-object.js");
var IndexedObject = __webpack_require__(/*! ../internals/indexed-object */ "./node_modules/core-js/internals/indexed-object.js");

var nativeAssign = Object.assign;
var defineProperty = Object.defineProperty;

// `Object.assign` method
// https://tc39.github.io/ecma262/#sec-object.assign
module.exports = !nativeAssign || fails(function () {
  // should have correct order of operations (Edge bug)
  if (DESCRIPTORS && nativeAssign({ b: 1 }, nativeAssign(defineProperty({}, 'a', {
    enumerable: true,
    get: function () {
      defineProperty(this, 'b', {
        value: 3,
        enumerable: false
      });
    }
  }), { b: 2 })).b !== 1) return true;
  // should work with symbols and should have deterministic property order (V8 bug)
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var symbol = Symbol();
  var alphabet = 'abcdefghijklmnopqrst';
  A[symbol] = 7;
  alphabet.split('').forEach(function (chr) { B[chr] = chr; });
  return nativeAssign({}, A)[symbol] != 7 || objectKeys(nativeAssign({}, B)).join('') != alphabet;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var argumentsLength = arguments.length;
  var index = 1;
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  var propertyIsEnumerable = propertyIsEnumerableModule.f;
  while (argumentsLength > index) {
    var S = IndexedObject(arguments[index++]);
    var keys = getOwnPropertySymbols ? objectKeys(S).concat(getOwnPropertySymbols(S)) : objectKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) {
      key = keys[j++];
      if (!DESCRIPTORS || propertyIsEnumerable.call(S, key)) T[key] = S[key];
    }
  } return T;
} : nativeAssign;


/***/ }),

/***/ "./node_modules/core-js/internals/redefine-all.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/internals/redefine-all.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var redefine = __webpack_require__(/*! ../internals/redefine */ "./node_modules/core-js/internals/redefine.js");

module.exports = function (target, src, options) {
  for (var key in src) redefine(target, key, src[key], options);
  return target;
};


/***/ }),

/***/ "./node_modules/core-js/internals/set-species.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/set-species.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js/internals/get-built-in.js");
var definePropertyModule = __webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");
var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");

var SPECIES = wellKnownSymbol('species');

module.exports = function (CONSTRUCTOR_NAME) {
  var Constructor = getBuiltIn(CONSTRUCTOR_NAME);
  var defineProperty = definePropertyModule.f;

  if (DESCRIPTORS && Constructor && !Constructor[SPECIES]) {
    defineProperty(Constructor, SPECIES, {
      configurable: true,
      get: function () { return this; }
    });
  }
};


/***/ }),

/***/ "./node_modules/core-js/internals/string-punycode-to-ascii.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/internals/string-punycode-to-ascii.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// based on https://github.com/bestiejs/punycode.js/blob/master/punycode.js
var maxInt = 2147483647; // aka. 0x7FFFFFFF or 2^31-1
var base = 36;
var tMin = 1;
var tMax = 26;
var skew = 38;
var damp = 700;
var initialBias = 72;
var initialN = 128; // 0x80
var delimiter = '-'; // '\x2D'
var regexNonASCII = /[^\0-\u007E]/; // non-ASCII chars
var regexSeparators = /[.\u3002\uFF0E\uFF61]/g; // RFC 3490 separators
var OVERFLOW_ERROR = 'Overflow: input needs wider integers to process';
var baseMinusTMin = base - tMin;
var floor = Math.floor;
var stringFromCharCode = String.fromCharCode;

/**
 * Creates an array containing the numeric code points of each Unicode
 * character in the string. While JavaScript uses UCS-2 internally,
 * this function will convert a pair of surrogate halves (each of which
 * UCS-2 exposes as separate characters) into a single code point,
 * matching UTF-16.
 */
var ucs2decode = function (string) {
  var output = [];
  var counter = 0;
  var length = string.length;
  while (counter < length) {
    var value = string.charCodeAt(counter++);
    if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
      // It's a high surrogate, and there is a next character.
      var extra = string.charCodeAt(counter++);
      if ((extra & 0xFC00) == 0xDC00) { // Low surrogate.
        output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
      } else {
        // It's an unmatched surrogate; only append this code unit, in case the
        // next code unit is the high surrogate of a surrogate pair.
        output.push(value);
        counter--;
      }
    } else {
      output.push(value);
    }
  }
  return output;
};

/**
 * Converts a digit/integer into a basic code point.
 */
var digitToBasic = function (digit) {
  //  0..25 map to ASCII a..z or A..Z
  // 26..35 map to ASCII 0..9
  return digit + 22 + 75 * (digit < 26);
};

/**
 * Bias adaptation function as per section 3.4 of RFC 3492.
 * https://tools.ietf.org/html/rfc3492#section-3.4
 */
var adapt = function (delta, numPoints, firstTime) {
  var k = 0;
  delta = firstTime ? floor(delta / damp) : delta >> 1;
  delta += floor(delta / numPoints);
  for (; delta > baseMinusTMin * tMax >> 1; k += base) {
    delta = floor(delta / baseMinusTMin);
  }
  return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
};

/**
 * Converts a string of Unicode symbols (e.g. a domain name label) to a
 * Punycode string of ASCII-only symbols.
 */
// eslint-disable-next-line  max-statements
var encode = function (input) {
  var output = [];

  // Convert the input in UCS-2 to an array of Unicode code points.
  input = ucs2decode(input);

  // Cache the length.
  var inputLength = input.length;

  // Initialize the state.
  var n = initialN;
  var delta = 0;
  var bias = initialBias;
  var i, currentValue;

  // Handle the basic code points.
  for (i = 0; i < input.length; i++) {
    currentValue = input[i];
    if (currentValue < 0x80) {
      output.push(stringFromCharCode(currentValue));
    }
  }

  var basicLength = output.length; // number of basic code points.
  var handledCPCount = basicLength; // number of code points that have been handled;

  // Finish the basic string with a delimiter unless it's empty.
  if (basicLength) {
    output.push(delimiter);
  }

  // Main encoding loop:
  while (handledCPCount < inputLength) {
    // All non-basic code points < n have been handled already. Find the next larger one:
    var m = maxInt;
    for (i = 0; i < input.length; i++) {
      currentValue = input[i];
      if (currentValue >= n && currentValue < m) {
        m = currentValue;
      }
    }

    // Increase `delta` enough to advance the decoder's <n,i> state to <m,0>, but guard against overflow.
    var handledCPCountPlusOne = handledCPCount + 1;
    if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
      throw RangeError(OVERFLOW_ERROR);
    }

    delta += (m - n) * handledCPCountPlusOne;
    n = m;

    for (i = 0; i < input.length; i++) {
      currentValue = input[i];
      if (currentValue < n && ++delta > maxInt) {
        throw RangeError(OVERFLOW_ERROR);
      }
      if (currentValue == n) {
        // Represent delta as a generalized variable-length integer.
        var q = delta;
        for (var k = base; /* no condition */; k += base) {
          var t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
          if (q < t) break;
          var qMinusT = q - t;
          var baseMinusT = base - t;
          output.push(stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT)));
          q = floor(qMinusT / baseMinusT);
        }

        output.push(stringFromCharCode(digitToBasic(q)));
        bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
        delta = 0;
        ++handledCPCount;
      }
    }

    ++delta;
    ++n;
  }
  return output.join('');
};

module.exports = function (input) {
  var encoded = [];
  var labels = input.toLowerCase().replace(regexSeparators, '\u002E').split('.');
  var i, label;
  for (i = 0; i < labels.length; i++) {
    label = labels[i];
    encoded.push(regexNonASCII.test(label) ? 'xn--' + encode(label) : label);
  }
  return encoded.join('.');
};


/***/ }),

/***/ "./node_modules/core-js/internals/string-trim-forced.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js/internals/string-trim-forced.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var whitespaces = __webpack_require__(/*! ../internals/whitespaces */ "./node_modules/core-js/internals/whitespaces.js");

var non = '\u200B\u0085\u180E';

// check that a method works with the correct list
// of whitespaces and has a correct name
module.exports = function (METHOD_NAME) {
  return fails(function () {
    return !!whitespaces[METHOD_NAME]() || non[METHOD_NAME]() != non || whitespaces[METHOD_NAME].name !== METHOD_NAME;
  });
};


/***/ }),

/***/ "./node_modules/core-js/internals/string-trim.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/string-trim.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var requireObjectCoercible = __webpack_require__(/*! ../internals/require-object-coercible */ "./node_modules/core-js/internals/require-object-coercible.js");
var whitespaces = __webpack_require__(/*! ../internals/whitespaces */ "./node_modules/core-js/internals/whitespaces.js");

var whitespace = '[' + whitespaces + ']';
var ltrim = RegExp('^' + whitespace + whitespace + '*');
var rtrim = RegExp(whitespace + whitespace + '*$');

// `String.prototype.{ trim, trimStart, trimEnd, trimLeft, trimRight }` methods implementation
var createMethod = function (TYPE) {
  return function ($this) {
    var string = String(requireObjectCoercible($this));
    if (TYPE & 1) string = string.replace(ltrim, '');
    if (TYPE & 2) string = string.replace(rtrim, '');
    return string;
  };
};

module.exports = {
  // `String.prototype.{ trimLeft, trimStart }` methods
  // https://tc39.github.io/ecma262/#sec-string.prototype.trimstart
  start: createMethod(1),
  // `String.prototype.{ trimRight, trimEnd }` methods
  // https://tc39.github.io/ecma262/#sec-string.prototype.trimend
  end: createMethod(2),
  // `String.prototype.trim` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.trim
  trim: createMethod(3)
};


/***/ }),

/***/ "./node_modules/core-js/internals/to-index.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/internals/to-index.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(/*! ../internals/to-integer */ "./node_modules/core-js/internals/to-integer.js");
var toLength = __webpack_require__(/*! ../internals/to-length */ "./node_modules/core-js/internals/to-length.js");

// `ToIndex` abstract operation
// https://tc39.github.io/ecma262/#sec-toindex
module.exports = function (it) {
  if (it === undefined) return 0;
  var number = toInteger(it);
  var length = toLength(number);
  if (number !== length) throw RangeError('Wrong length or index');
  return length;
};


/***/ }),

/***/ "./node_modules/core-js/internals/to-offset.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/to-offset.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var toPositiveInteger = __webpack_require__(/*! ../internals/to-positive-integer */ "./node_modules/core-js/internals/to-positive-integer.js");

module.exports = function (it, BYTES) {
  var offset = toPositiveInteger(it);
  if (offset % BYTES) throw RangeError('Wrong offset');
  return offset;
};


/***/ }),

/***/ "./node_modules/core-js/internals/to-positive-integer.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js/internals/to-positive-integer.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(/*! ../internals/to-integer */ "./node_modules/core-js/internals/to-integer.js");

module.exports = function (it) {
  var result = toInteger(it);
  if (result < 0) throw RangeError("The argument can't be less than 0");
  return result;
};


/***/ }),

/***/ "./node_modules/core-js/internals/typed-array-constructor.js":
/*!*******************************************************************!*\
  !*** ./node_modules/core-js/internals/typed-array-constructor.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var TYPED_ARRAYS_CONSTRUCTORS_REQUIRES_WRAPPERS = __webpack_require__(/*! ../internals/typed-array-constructors-require-wrappers */ "./node_modules/core-js/internals/typed-array-constructors-require-wrappers.js");
var ArrayBufferViewCore = __webpack_require__(/*! ../internals/array-buffer-view-core */ "./node_modules/core-js/internals/array-buffer-view-core.js");
var ArrayBufferModule = __webpack_require__(/*! ../internals/array-buffer */ "./node_modules/core-js/internals/array-buffer.js");
var anInstance = __webpack_require__(/*! ../internals/an-instance */ "./node_modules/core-js/internals/an-instance.js");
var createPropertyDescriptor = __webpack_require__(/*! ../internals/create-property-descriptor */ "./node_modules/core-js/internals/create-property-descriptor.js");
var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "./node_modules/core-js/internals/create-non-enumerable-property.js");
var toLength = __webpack_require__(/*! ../internals/to-length */ "./node_modules/core-js/internals/to-length.js");
var toIndex = __webpack_require__(/*! ../internals/to-index */ "./node_modules/core-js/internals/to-index.js");
var toOffset = __webpack_require__(/*! ../internals/to-offset */ "./node_modules/core-js/internals/to-offset.js");
var toPrimitive = __webpack_require__(/*! ../internals/to-primitive */ "./node_modules/core-js/internals/to-primitive.js");
var has = __webpack_require__(/*! ../internals/has */ "./node_modules/core-js/internals/has.js");
var classof = __webpack_require__(/*! ../internals/classof */ "./node_modules/core-js/internals/classof.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");
var create = __webpack_require__(/*! ../internals/object-create */ "./node_modules/core-js/internals/object-create.js");
var setPrototypeOf = __webpack_require__(/*! ../internals/object-set-prototype-of */ "./node_modules/core-js/internals/object-set-prototype-of.js");
var getOwnPropertyNames = __webpack_require__(/*! ../internals/object-get-own-property-names */ "./node_modules/core-js/internals/object-get-own-property-names.js").f;
var typedArrayFrom = __webpack_require__(/*! ../internals/typed-array-from */ "./node_modules/core-js/internals/typed-array-from.js");
var forEach = __webpack_require__(/*! ../internals/array-iteration */ "./node_modules/core-js/internals/array-iteration.js").forEach;
var setSpecies = __webpack_require__(/*! ../internals/set-species */ "./node_modules/core-js/internals/set-species.js");
var definePropertyModule = __webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js");
var getOwnPropertyDescriptorModule = __webpack_require__(/*! ../internals/object-get-own-property-descriptor */ "./node_modules/core-js/internals/object-get-own-property-descriptor.js");
var InternalStateModule = __webpack_require__(/*! ../internals/internal-state */ "./node_modules/core-js/internals/internal-state.js");
var inheritIfRequired = __webpack_require__(/*! ../internals/inherit-if-required */ "./node_modules/core-js/internals/inherit-if-required.js");

var getInternalState = InternalStateModule.get;
var setInternalState = InternalStateModule.set;
var nativeDefineProperty = definePropertyModule.f;
var nativeGetOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
var round = Math.round;
var RangeError = global.RangeError;
var ArrayBuffer = ArrayBufferModule.ArrayBuffer;
var DataView = ArrayBufferModule.DataView;
var NATIVE_ARRAY_BUFFER_VIEWS = ArrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS;
var TYPED_ARRAY_TAG = ArrayBufferViewCore.TYPED_ARRAY_TAG;
var TypedArray = ArrayBufferViewCore.TypedArray;
var TypedArrayPrototype = ArrayBufferViewCore.TypedArrayPrototype;
var aTypedArrayConstructor = ArrayBufferViewCore.aTypedArrayConstructor;
var isTypedArray = ArrayBufferViewCore.isTypedArray;
var BYTES_PER_ELEMENT = 'BYTES_PER_ELEMENT';
var WRONG_LENGTH = 'Wrong length';

var fromList = function (C, list) {
  var index = 0;
  var length = list.length;
  var result = new (aTypedArrayConstructor(C))(length);
  while (length > index) result[index] = list[index++];
  return result;
};

var addGetter = function (it, key) {
  nativeDefineProperty(it, key, { get: function () {
    return getInternalState(this)[key];
  } });
};

var isArrayBuffer = function (it) {
  var klass;
  return it instanceof ArrayBuffer || (klass = classof(it)) == 'ArrayBuffer' || klass == 'SharedArrayBuffer';
};

var isTypedArrayIndex = function (target, key) {
  return isTypedArray(target)
    && typeof key != 'symbol'
    && key in target
    && String(+key) == String(key);
};

var wrappedGetOwnPropertyDescriptor = function getOwnPropertyDescriptor(target, key) {
  return isTypedArrayIndex(target, key = toPrimitive(key, true))
    ? createPropertyDescriptor(2, target[key])
    : nativeGetOwnPropertyDescriptor(target, key);
};

var wrappedDefineProperty = function defineProperty(target, key, descriptor) {
  if (isTypedArrayIndex(target, key = toPrimitive(key, true))
    && isObject(descriptor)
    && has(descriptor, 'value')
    && !has(descriptor, 'get')
    && !has(descriptor, 'set')
    // TODO: add validation descriptor w/o calling accessors
    && !descriptor.configurable
    && (!has(descriptor, 'writable') || descriptor.writable)
    && (!has(descriptor, 'enumerable') || descriptor.enumerable)
  ) {
    target[key] = descriptor.value;
    return target;
  } return nativeDefineProperty(target, key, descriptor);
};

if (DESCRIPTORS) {
  if (!NATIVE_ARRAY_BUFFER_VIEWS) {
    getOwnPropertyDescriptorModule.f = wrappedGetOwnPropertyDescriptor;
    definePropertyModule.f = wrappedDefineProperty;
    addGetter(TypedArrayPrototype, 'buffer');
    addGetter(TypedArrayPrototype, 'byteOffset');
    addGetter(TypedArrayPrototype, 'byteLength');
    addGetter(TypedArrayPrototype, 'length');
  }

  $({ target: 'Object', stat: true, forced: !NATIVE_ARRAY_BUFFER_VIEWS }, {
    getOwnPropertyDescriptor: wrappedGetOwnPropertyDescriptor,
    defineProperty: wrappedDefineProperty
  });

  module.exports = function (TYPE, wrapper, CLAMPED) {
    var BYTES = TYPE.match(/\d+$/)[0] / 8;
    var CONSTRUCTOR_NAME = TYPE + (CLAMPED ? 'Clamped' : '') + 'Array';
    var GETTER = 'get' + TYPE;
    var SETTER = 'set' + TYPE;
    var NativeTypedArrayConstructor = global[CONSTRUCTOR_NAME];
    var TypedArrayConstructor = NativeTypedArrayConstructor;
    var TypedArrayConstructorPrototype = TypedArrayConstructor && TypedArrayConstructor.prototype;
    var exported = {};

    var getter = function (that, index) {
      var data = getInternalState(that);
      return data.view[GETTER](index * BYTES + data.byteOffset, true);
    };

    var setter = function (that, index, value) {
      var data = getInternalState(that);
      if (CLAMPED) value = (value = round(value)) < 0 ? 0 : value > 0xFF ? 0xFF : value & 0xFF;
      data.view[SETTER](index * BYTES + data.byteOffset, value, true);
    };

    var addElement = function (that, index) {
      nativeDefineProperty(that, index, {
        get: function () {
          return getter(this, index);
        },
        set: function (value) {
          return setter(this, index, value);
        },
        enumerable: true
      });
    };

    if (!NATIVE_ARRAY_BUFFER_VIEWS) {
      TypedArrayConstructor = wrapper(function (that, data, offset, $length) {
        anInstance(that, TypedArrayConstructor, CONSTRUCTOR_NAME);
        var index = 0;
        var byteOffset = 0;
        var buffer, byteLength, length;
        if (!isObject(data)) {
          length = toIndex(data);
          byteLength = length * BYTES;
          buffer = new ArrayBuffer(byteLength);
        } else if (isArrayBuffer(data)) {
          buffer = data;
          byteOffset = toOffset(offset, BYTES);
          var $len = data.byteLength;
          if ($length === undefined) {
            if ($len % BYTES) throw RangeError(WRONG_LENGTH);
            byteLength = $len - byteOffset;
            if (byteLength < 0) throw RangeError(WRONG_LENGTH);
          } else {
            byteLength = toLength($length) * BYTES;
            if (byteLength + byteOffset > $len) throw RangeError(WRONG_LENGTH);
          }
          length = byteLength / BYTES;
        } else if (isTypedArray(data)) {
          return fromList(TypedArrayConstructor, data);
        } else {
          return typedArrayFrom.call(TypedArrayConstructor, data);
        }
        setInternalState(that, {
          buffer: buffer,
          byteOffset: byteOffset,
          byteLength: byteLength,
          length: length,
          view: new DataView(buffer)
        });
        while (index < length) addElement(that, index++);
      });

      if (setPrototypeOf) setPrototypeOf(TypedArrayConstructor, TypedArray);
      TypedArrayConstructorPrototype = TypedArrayConstructor.prototype = create(TypedArrayPrototype);
    } else if (TYPED_ARRAYS_CONSTRUCTORS_REQUIRES_WRAPPERS) {
      TypedArrayConstructor = wrapper(function (dummy, data, typedArrayOffset, $length) {
        anInstance(dummy, TypedArrayConstructor, CONSTRUCTOR_NAME);
        return inheritIfRequired(function () {
          if (!isObject(data)) return new NativeTypedArrayConstructor(toIndex(data));
          if (isArrayBuffer(data)) return $length !== undefined
            ? new NativeTypedArrayConstructor(data, toOffset(typedArrayOffset, BYTES), $length)
            : typedArrayOffset !== undefined
              ? new NativeTypedArrayConstructor(data, toOffset(typedArrayOffset, BYTES))
              : new NativeTypedArrayConstructor(data);
          if (isTypedArray(data)) return fromList(TypedArrayConstructor, data);
          return typedArrayFrom.call(TypedArrayConstructor, data);
        }(), dummy, TypedArrayConstructor);
      });

      if (setPrototypeOf) setPrototypeOf(TypedArrayConstructor, TypedArray);
      forEach(getOwnPropertyNames(NativeTypedArrayConstructor), function (key) {
        if (!(key in TypedArrayConstructor)) {
          createNonEnumerableProperty(TypedArrayConstructor, key, NativeTypedArrayConstructor[key]);
        }
      });
      TypedArrayConstructor.prototype = TypedArrayConstructorPrototype;
    }

    if (TypedArrayConstructorPrototype.constructor !== TypedArrayConstructor) {
      createNonEnumerableProperty(TypedArrayConstructorPrototype, 'constructor', TypedArrayConstructor);
    }

    if (TYPED_ARRAY_TAG) {
      createNonEnumerableProperty(TypedArrayConstructorPrototype, TYPED_ARRAY_TAG, CONSTRUCTOR_NAME);
    }

    exported[CONSTRUCTOR_NAME] = TypedArrayConstructor;

    $({
      global: true, forced: TypedArrayConstructor != NativeTypedArrayConstructor, sham: !NATIVE_ARRAY_BUFFER_VIEWS
    }, exported);

    if (!(BYTES_PER_ELEMENT in TypedArrayConstructor)) {
      createNonEnumerableProperty(TypedArrayConstructor, BYTES_PER_ELEMENT, BYTES);
    }

    if (!(BYTES_PER_ELEMENT in TypedArrayConstructorPrototype)) {
      createNonEnumerableProperty(TypedArrayConstructorPrototype, BYTES_PER_ELEMENT, BYTES);
    }

    setSpecies(CONSTRUCTOR_NAME);
  };
} else module.exports = function () { /* empty */ };


/***/ }),

/***/ "./node_modules/core-js/internals/typed-array-constructors-require-wrappers.js":
/*!*************************************************************************************!*\
  !*** ./node_modules/core-js/internals/typed-array-constructors-require-wrappers.js ***!
  \*************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* eslint-disable no-new */
var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var checkCorrectnessOfIteration = __webpack_require__(/*! ../internals/check-correctness-of-iteration */ "./node_modules/core-js/internals/check-correctness-of-iteration.js");
var NATIVE_ARRAY_BUFFER_VIEWS = __webpack_require__(/*! ../internals/array-buffer-view-core */ "./node_modules/core-js/internals/array-buffer-view-core.js").NATIVE_ARRAY_BUFFER_VIEWS;

var ArrayBuffer = global.ArrayBuffer;
var Int8Array = global.Int8Array;

module.exports = !NATIVE_ARRAY_BUFFER_VIEWS || !fails(function () {
  Int8Array(1);
}) || !fails(function () {
  new Int8Array(-1);
}) || !checkCorrectnessOfIteration(function (iterable) {
  new Int8Array();
  new Int8Array(null);
  new Int8Array(1.5);
  new Int8Array(iterable);
}, true) || fails(function () {
  // Safari (11+) bug - a reason why even Safari 13 should load a typed array polyfill
  return new Int8Array(new ArrayBuffer(2), 1, undefined).length !== 1;
});


/***/ }),

/***/ "./node_modules/core-js/internals/typed-array-from.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/internals/typed-array-from.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js/internals/to-object.js");
var toLength = __webpack_require__(/*! ../internals/to-length */ "./node_modules/core-js/internals/to-length.js");
var getIteratorMethod = __webpack_require__(/*! ../internals/get-iterator-method */ "./node_modules/core-js/internals/get-iterator-method.js");
var isArrayIteratorMethod = __webpack_require__(/*! ../internals/is-array-iterator-method */ "./node_modules/core-js/internals/is-array-iterator-method.js");
var bind = __webpack_require__(/*! ../internals/function-bind-context */ "./node_modules/core-js/internals/function-bind-context.js");
var aTypedArrayConstructor = __webpack_require__(/*! ../internals/array-buffer-view-core */ "./node_modules/core-js/internals/array-buffer-view-core.js").aTypedArrayConstructor;

module.exports = function from(source /* , mapfn, thisArg */) {
  var O = toObject(source);
  var argumentsLength = arguments.length;
  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
  var mapping = mapfn !== undefined;
  var iteratorMethod = getIteratorMethod(O);
  var i, length, result, step, iterator, next;
  if (iteratorMethod != undefined && !isArrayIteratorMethod(iteratorMethod)) {
    iterator = iteratorMethod.call(O);
    next = iterator.next;
    O = [];
    while (!(step = next.call(iterator)).done) {
      O.push(step.value);
    }
  }
  if (mapping && argumentsLength > 2) {
    mapfn = bind(mapfn, arguments[2], 2);
  }
  length = toLength(O.length);
  result = new (aTypedArrayConstructor(this))(length);
  for (i = 0; length > i; i++) {
    result[i] = mapping ? mapfn(O[i], i) : O[i];
  }
  return result;
};


/***/ }),

/***/ "./node_modules/core-js/internals/whitespaces.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/whitespaces.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// a string of all valid unicode whitespaces
// eslint-disable-next-line max-len
module.exports = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';


/***/ }),

/***/ "./node_modules/core-js/modules/es.array-buffer.constructor.js":
/*!*********************************************************************!*\
  !*** ./node_modules/core-js/modules/es.array-buffer.constructor.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var arrayBufferModule = __webpack_require__(/*! ../internals/array-buffer */ "./node_modules/core-js/internals/array-buffer.js");
var setSpecies = __webpack_require__(/*! ../internals/set-species */ "./node_modules/core-js/internals/set-species.js");

var ARRAY_BUFFER = 'ArrayBuffer';
var ArrayBuffer = arrayBufferModule[ARRAY_BUFFER];
var NativeArrayBuffer = global[ARRAY_BUFFER];

// `ArrayBuffer` constructor
// https://tc39.github.io/ecma262/#sec-arraybuffer-constructor
$({ global: true, forced: NativeArrayBuffer !== ArrayBuffer }, {
  ArrayBuffer: ArrayBuffer
});

setSpecies(ARRAY_BUFFER);


/***/ }),

/***/ "./node_modules/core-js/modules/es.array-buffer.slice.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js/modules/es.array-buffer.slice.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var ArrayBufferModule = __webpack_require__(/*! ../internals/array-buffer */ "./node_modules/core-js/internals/array-buffer.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var toAbsoluteIndex = __webpack_require__(/*! ../internals/to-absolute-index */ "./node_modules/core-js/internals/to-absolute-index.js");
var toLength = __webpack_require__(/*! ../internals/to-length */ "./node_modules/core-js/internals/to-length.js");
var speciesConstructor = __webpack_require__(/*! ../internals/species-constructor */ "./node_modules/core-js/internals/species-constructor.js");

var ArrayBuffer = ArrayBufferModule.ArrayBuffer;
var DataView = ArrayBufferModule.DataView;
var nativeArrayBufferSlice = ArrayBuffer.prototype.slice;

var INCORRECT_SLICE = fails(function () {
  return !new ArrayBuffer(2).slice(1, undefined).byteLength;
});

// `ArrayBuffer.prototype.slice` method
// https://tc39.github.io/ecma262/#sec-arraybuffer.prototype.slice
$({ target: 'ArrayBuffer', proto: true, unsafe: true, forced: INCORRECT_SLICE }, {
  slice: function slice(start, end) {
    if (nativeArrayBufferSlice !== undefined && end === undefined) {
      return nativeArrayBufferSlice.call(anObject(this), start); // FF fix
    }
    var length = anObject(this).byteLength;
    var first = toAbsoluteIndex(start, length);
    var fin = toAbsoluteIndex(end === undefined ? length : end, length);
    var result = new (speciesConstructor(this, ArrayBuffer))(toLength(fin - first));
    var viewSource = new DataView(this);
    var viewTarget = new DataView(result);
    var index = 0;
    while (first < fin) {
      viewTarget.setUint8(index++, viewSource.getUint8(first++));
    } return result;
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/es.array.concat.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/modules/es.array.concat.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var isArray = __webpack_require__(/*! ../internals/is-array */ "./node_modules/core-js/internals/is-array.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");
var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js/internals/to-object.js");
var toLength = __webpack_require__(/*! ../internals/to-length */ "./node_modules/core-js/internals/to-length.js");
var createProperty = __webpack_require__(/*! ../internals/create-property */ "./node_modules/core-js/internals/create-property.js");
var arraySpeciesCreate = __webpack_require__(/*! ../internals/array-species-create */ "./node_modules/core-js/internals/array-species-create.js");
var arrayMethodHasSpeciesSupport = __webpack_require__(/*! ../internals/array-method-has-species-support */ "./node_modules/core-js/internals/array-method-has-species-support.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");
var V8_VERSION = __webpack_require__(/*! ../internals/engine-v8-version */ "./node_modules/core-js/internals/engine-v8-version.js");

var IS_CONCAT_SPREADABLE = wellKnownSymbol('isConcatSpreadable');
var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
var MAXIMUM_ALLOWED_INDEX_EXCEEDED = 'Maximum allowed index exceeded';

// We can't use this feature detection in V8 since it causes
// deoptimization and serious performance degradation
// https://github.com/zloirock/core-js/issues/679
var IS_CONCAT_SPREADABLE_SUPPORT = V8_VERSION >= 51 || !fails(function () {
  var array = [];
  array[IS_CONCAT_SPREADABLE] = false;
  return array.concat()[0] !== array;
});

var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('concat');

var isConcatSpreadable = function (O) {
  if (!isObject(O)) return false;
  var spreadable = O[IS_CONCAT_SPREADABLE];
  return spreadable !== undefined ? !!spreadable : isArray(O);
};

var FORCED = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT;

// `Array.prototype.concat` method
// https://tc39.github.io/ecma262/#sec-array.prototype.concat
// with adding support of @@isConcatSpreadable and @@species
$({ target: 'Array', proto: true, forced: FORCED }, {
  concat: function concat(arg) { // eslint-disable-line no-unused-vars
    var O = toObject(this);
    var A = arraySpeciesCreate(O, 0);
    var n = 0;
    var i, k, length, len, E;
    for (i = -1, length = arguments.length; i < length; i++) {
      E = i === -1 ? O : arguments[i];
      if (isConcatSpreadable(E)) {
        len = toLength(E.length);
        if (n + len > MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
        for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
      } else {
        if (n >= MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
        createProperty(A, n++, E);
      }
    }
    A.length = n;
    return A;
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/es.array.filter.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/modules/es.array.filter.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var $filter = __webpack_require__(/*! ../internals/array-iteration */ "./node_modules/core-js/internals/array-iteration.js").filter;
var arrayMethodHasSpeciesSupport = __webpack_require__(/*! ../internals/array-method-has-species-support */ "./node_modules/core-js/internals/array-method-has-species-support.js");
var arrayMethodUsesToLength = __webpack_require__(/*! ../internals/array-method-uses-to-length */ "./node_modules/core-js/internals/array-method-uses-to-length.js");

var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('filter');
// Edge 14- issue
var USES_TO_LENGTH = arrayMethodUsesToLength('filter');

// `Array.prototype.filter` method
// https://tc39.github.io/ecma262/#sec-array.prototype.filter
// with adding support of @@species
$({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT || !USES_TO_LENGTH }, {
  filter: function filter(callbackfn /* , thisArg */) {
    return $filter(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/es.array.for-each.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/modules/es.array.for-each.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var forEach = __webpack_require__(/*! ../internals/array-for-each */ "./node_modules/core-js/internals/array-for-each.js");

// `Array.prototype.forEach` method
// https://tc39.github.io/ecma262/#sec-array.prototype.foreach
$({ target: 'Array', proto: true, forced: [].forEach != forEach }, {
  forEach: forEach
});


/***/ }),

/***/ "./node_modules/core-js/modules/es.array.from.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/modules/es.array.from.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var from = __webpack_require__(/*! ../internals/array-from */ "./node_modules/core-js/internals/array-from.js");
var checkCorrectnessOfIteration = __webpack_require__(/*! ../internals/check-correctness-of-iteration */ "./node_modules/core-js/internals/check-correctness-of-iteration.js");

var INCORRECT_ITERATION = !checkCorrectnessOfIteration(function (iterable) {
  Array.from(iterable);
});

// `Array.from` method
// https://tc39.github.io/ecma262/#sec-array.from
$({ target: 'Array', stat: true, forced: INCORRECT_ITERATION }, {
  from: from
});


/***/ }),

/***/ "./node_modules/core-js/modules/es.array.index-of.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/modules/es.array.index-of.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var $indexOf = __webpack_require__(/*! ../internals/array-includes */ "./node_modules/core-js/internals/array-includes.js").indexOf;
var arrayMethodIsStrict = __webpack_require__(/*! ../internals/array-method-is-strict */ "./node_modules/core-js/internals/array-method-is-strict.js");
var arrayMethodUsesToLength = __webpack_require__(/*! ../internals/array-method-uses-to-length */ "./node_modules/core-js/internals/array-method-uses-to-length.js");

var nativeIndexOf = [].indexOf;

var NEGATIVE_ZERO = !!nativeIndexOf && 1 / [1].indexOf(1, -0) < 0;
var STRICT_METHOD = arrayMethodIsStrict('indexOf');
var USES_TO_LENGTH = arrayMethodUsesToLength('indexOf', { ACCESSORS: true, 1: 0 });

// `Array.prototype.indexOf` method
// https://tc39.github.io/ecma262/#sec-array.prototype.indexof
$({ target: 'Array', proto: true, forced: NEGATIVE_ZERO || !STRICT_METHOD || !USES_TO_LENGTH }, {
  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
    return NEGATIVE_ZERO
      // convert -0 to +0
      ? nativeIndexOf.apply(this, arguments) || 0
      : $indexOf(this, searchElement, arguments.length > 1 ? arguments[1] : undefined);
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/es.array.is-array.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/modules/es.array.is-array.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var isArray = __webpack_require__(/*! ../internals/is-array */ "./node_modules/core-js/internals/is-array.js");

// `Array.isArray` method
// https://tc39.github.io/ecma262/#sec-array.isarray
$({ target: 'Array', stat: true }, {
  isArray: isArray
});


/***/ }),

/***/ "./node_modules/core-js/modules/es.array.map.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/modules/es.array.map.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var $map = __webpack_require__(/*! ../internals/array-iteration */ "./node_modules/core-js/internals/array-iteration.js").map;
var arrayMethodHasSpeciesSupport = __webpack_require__(/*! ../internals/array-method-has-species-support */ "./node_modules/core-js/internals/array-method-has-species-support.js");
var arrayMethodUsesToLength = __webpack_require__(/*! ../internals/array-method-uses-to-length */ "./node_modules/core-js/internals/array-method-uses-to-length.js");

var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('map');
// FF49- issue
var USES_TO_LENGTH = arrayMethodUsesToLength('map');

// `Array.prototype.map` method
// https://tc39.github.io/ecma262/#sec-array.prototype.map
// with adding support of @@species
$({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT || !USES_TO_LENGTH }, {
  map: function map(callbackfn /* , thisArg */) {
    return $map(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/es.array.slice.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/modules/es.array.slice.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");
var isArray = __webpack_require__(/*! ../internals/is-array */ "./node_modules/core-js/internals/is-array.js");
var toAbsoluteIndex = __webpack_require__(/*! ../internals/to-absolute-index */ "./node_modules/core-js/internals/to-absolute-index.js");
var toLength = __webpack_require__(/*! ../internals/to-length */ "./node_modules/core-js/internals/to-length.js");
var toIndexedObject = __webpack_require__(/*! ../internals/to-indexed-object */ "./node_modules/core-js/internals/to-indexed-object.js");
var createProperty = __webpack_require__(/*! ../internals/create-property */ "./node_modules/core-js/internals/create-property.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");
var arrayMethodHasSpeciesSupport = __webpack_require__(/*! ../internals/array-method-has-species-support */ "./node_modules/core-js/internals/array-method-has-species-support.js");
var arrayMethodUsesToLength = __webpack_require__(/*! ../internals/array-method-uses-to-length */ "./node_modules/core-js/internals/array-method-uses-to-length.js");

var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('slice');
var USES_TO_LENGTH = arrayMethodUsesToLength('slice', { ACCESSORS: true, 0: 0, 1: 2 });

var SPECIES = wellKnownSymbol('species');
var nativeSlice = [].slice;
var max = Math.max;

// `Array.prototype.slice` method
// https://tc39.github.io/ecma262/#sec-array.prototype.slice
// fallback for not array-like ES3 strings and DOM objects
$({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT || !USES_TO_LENGTH }, {
  slice: function slice(start, end) {
    var O = toIndexedObject(this);
    var length = toLength(O.length);
    var k = toAbsoluteIndex(start, length);
    var fin = toAbsoluteIndex(end === undefined ? length : end, length);
    // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible
    var Constructor, result, n;
    if (isArray(O)) {
      Constructor = O.constructor;
      // cross-realm fallback
      if (typeof Constructor == 'function' && (Constructor === Array || isArray(Constructor.prototype))) {
        Constructor = undefined;
      } else if (isObject(Constructor)) {
        Constructor = Constructor[SPECIES];
        if (Constructor === null) Constructor = undefined;
      }
      if (Constructor === Array || Constructor === undefined) {
        return nativeSlice.call(O, k, fin);
      }
    }
    result = new (Constructor === undefined ? Array : Constructor)(max(fin - k, 0));
    for (n = 0; k < fin; k++, n++) if (k in O) createProperty(result, n, O[k]);
    result.length = n;
    return result;
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/es.array.splice.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/modules/es.array.splice.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var toAbsoluteIndex = __webpack_require__(/*! ../internals/to-absolute-index */ "./node_modules/core-js/internals/to-absolute-index.js");
var toInteger = __webpack_require__(/*! ../internals/to-integer */ "./node_modules/core-js/internals/to-integer.js");
var toLength = __webpack_require__(/*! ../internals/to-length */ "./node_modules/core-js/internals/to-length.js");
var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js/internals/to-object.js");
var arraySpeciesCreate = __webpack_require__(/*! ../internals/array-species-create */ "./node_modules/core-js/internals/array-species-create.js");
var createProperty = __webpack_require__(/*! ../internals/create-property */ "./node_modules/core-js/internals/create-property.js");
var arrayMethodHasSpeciesSupport = __webpack_require__(/*! ../internals/array-method-has-species-support */ "./node_modules/core-js/internals/array-method-has-species-support.js");
var arrayMethodUsesToLength = __webpack_require__(/*! ../internals/array-method-uses-to-length */ "./node_modules/core-js/internals/array-method-uses-to-length.js");

var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('splice');
var USES_TO_LENGTH = arrayMethodUsesToLength('splice', { ACCESSORS: true, 0: 0, 1: 2 });

var max = Math.max;
var min = Math.min;
var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
var MAXIMUM_ALLOWED_LENGTH_EXCEEDED = 'Maximum allowed length exceeded';

// `Array.prototype.splice` method
// https://tc39.github.io/ecma262/#sec-array.prototype.splice
// with adding support of @@species
$({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT || !USES_TO_LENGTH }, {
  splice: function splice(start, deleteCount /* , ...items */) {
    var O = toObject(this);
    var len = toLength(O.length);
    var actualStart = toAbsoluteIndex(start, len);
    var argumentsLength = arguments.length;
    var insertCount, actualDeleteCount, A, k, from, to;
    if (argumentsLength === 0) {
      insertCount = actualDeleteCount = 0;
    } else if (argumentsLength === 1) {
      insertCount = 0;
      actualDeleteCount = len - actualStart;
    } else {
      insertCount = argumentsLength - 2;
      actualDeleteCount = min(max(toInteger(deleteCount), 0), len - actualStart);
    }
    if (len + insertCount - actualDeleteCount > MAX_SAFE_INTEGER) {
      throw TypeError(MAXIMUM_ALLOWED_LENGTH_EXCEEDED);
    }
    A = arraySpeciesCreate(O, actualDeleteCount);
    for (k = 0; k < actualDeleteCount; k++) {
      from = actualStart + k;
      if (from in O) createProperty(A, k, O[from]);
    }
    A.length = actualDeleteCount;
    if (insertCount < actualDeleteCount) {
      for (k = actualStart; k < len - actualDeleteCount; k++) {
        from = k + actualDeleteCount;
        to = k + insertCount;
        if (from in O) O[to] = O[from];
        else delete O[to];
      }
      for (k = len; k > len - actualDeleteCount + insertCount; k--) delete O[k - 1];
    } else if (insertCount > actualDeleteCount) {
      for (k = len - actualDeleteCount; k > actualStart; k--) {
        from = k + actualDeleteCount - 1;
        to = k + insertCount - 1;
        if (from in O) O[to] = O[from];
        else delete O[to];
      }
    }
    for (k = 0; k < insertCount; k++) {
      O[k + actualStart] = arguments[k + 2];
    }
    O.length = len - actualDeleteCount + insertCount;
    return A;
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/es.date.to-string.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/modules/es.date.to-string.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var redefine = __webpack_require__(/*! ../internals/redefine */ "./node_modules/core-js/internals/redefine.js");

var DatePrototype = Date.prototype;
var INVALID_DATE = 'Invalid Date';
var TO_STRING = 'toString';
var nativeDateToString = DatePrototype[TO_STRING];
var getTime = DatePrototype.getTime;

// `Date.prototype.toString` method
// https://tc39.github.io/ecma262/#sec-date.prototype.tostring
if (new Date(NaN) + '' != INVALID_DATE) {
  redefine(DatePrototype, TO_STRING, function toString() {
    var value = getTime.call(this);
    // eslint-disable-next-line no-self-compare
    return value === value ? nativeDateToString.call(this) : INVALID_DATE;
  });
}


/***/ }),

/***/ "./node_modules/core-js/modules/es.object.create.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/modules/es.object.create.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var create = __webpack_require__(/*! ../internals/object-create */ "./node_modules/core-js/internals/object-create.js");

// `Object.create` method
// https://tc39.github.io/ecma262/#sec-object.create
$({ target: 'Object', stat: true, sham: !DESCRIPTORS }, {
  create: create
});


/***/ }),

/***/ "./node_modules/core-js/modules/es.object.define-property.js":
/*!*******************************************************************!*\
  !*** ./node_modules/core-js/modules/es.object.define-property.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var objectDefinePropertyModile = __webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js");

// `Object.defineProperty` method
// https://tc39.github.io/ecma262/#sec-object.defineproperty
$({ target: 'Object', stat: true, forced: !DESCRIPTORS, sham: !DESCRIPTORS }, {
  defineProperty: objectDefinePropertyModile.f
});


/***/ }),

/***/ "./node_modules/core-js/modules/es.object.get-prototype-of.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/modules/es.object.get-prototype-of.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js/internals/to-object.js");
var nativeGetPrototypeOf = __webpack_require__(/*! ../internals/object-get-prototype-of */ "./node_modules/core-js/internals/object-get-prototype-of.js");
var CORRECT_PROTOTYPE_GETTER = __webpack_require__(/*! ../internals/correct-prototype-getter */ "./node_modules/core-js/internals/correct-prototype-getter.js");

var FAILS_ON_PRIMITIVES = fails(function () { nativeGetPrototypeOf(1); });

// `Object.getPrototypeOf` method
// https://tc39.github.io/ecma262/#sec-object.getprototypeof
$({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES, sham: !CORRECT_PROTOTYPE_GETTER }, {
  getPrototypeOf: function getPrototypeOf(it) {
    return nativeGetPrototypeOf(toObject(it));
  }
});



/***/ }),

/***/ "./node_modules/core-js/modules/es.object.set-prototype-of.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/modules/es.object.set-prototype-of.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var setPrototypeOf = __webpack_require__(/*! ../internals/object-set-prototype-of */ "./node_modules/core-js/internals/object-set-prototype-of.js");

// `Object.setPrototypeOf` method
// https://tc39.github.io/ecma262/#sec-object.setprototypeof
$({ target: 'Object', stat: true }, {
  setPrototypeOf: setPrototypeOf
});


/***/ }),

/***/ "./node_modules/core-js/modules/es.reflect.construct.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js/modules/es.reflect.construct.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js/internals/get-built-in.js");
var aFunction = __webpack_require__(/*! ../internals/a-function */ "./node_modules/core-js/internals/a-function.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");
var create = __webpack_require__(/*! ../internals/object-create */ "./node_modules/core-js/internals/object-create.js");
var bind = __webpack_require__(/*! ../internals/function-bind */ "./node_modules/core-js/internals/function-bind.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");

var nativeConstruct = getBuiltIn('Reflect', 'construct');

// `Reflect.construct` method
// https://tc39.github.io/ecma262/#sec-reflect.construct
// MS Edge supports only 2 arguments and argumentsList argument is optional
// FF Nightly sets third argument as `new.target`, but does not create `this` from it
var NEW_TARGET_BUG = fails(function () {
  function F() { /* empty */ }
  return !(nativeConstruct(function () { /* empty */ }, [], F) instanceof F);
});
var ARGS_BUG = !fails(function () {
  nativeConstruct(function () { /* empty */ });
});
var FORCED = NEW_TARGET_BUG || ARGS_BUG;

$({ target: 'Reflect', stat: true, forced: FORCED, sham: FORCED }, {
  construct: function construct(Target, args /* , newTarget */) {
    aFunction(Target);
    anObject(args);
    var newTarget = arguments.length < 3 ? Target : aFunction(arguments[2]);
    if (ARGS_BUG && !NEW_TARGET_BUG) return nativeConstruct(Target, args, newTarget);
    if (Target == newTarget) {
      // w/o altered newTarget, optimization for 0-4 arguments
      switch (args.length) {
        case 0: return new Target();
        case 1: return new Target(args[0]);
        case 2: return new Target(args[0], args[1]);
        case 3: return new Target(args[0], args[1], args[2]);
        case 4: return new Target(args[0], args[1], args[2], args[3]);
      }
      // w/o altered newTarget, lot of arguments case
      var $args = [null];
      $args.push.apply($args, args);
      return new (bind.apply(Target, $args))();
    }
    // with altered newTarget, not support built-in constructors
    var proto = newTarget.prototype;
    var instance = create(isObject(proto) ? proto : Object.prototype);
    var result = Function.apply.call(Target, instance, args);
    return isObject(result) ? result : instance;
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/es.regexp.to-string.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/modules/es.regexp.to-string.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var redefine = __webpack_require__(/*! ../internals/redefine */ "./node_modules/core-js/internals/redefine.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var flags = __webpack_require__(/*! ../internals/regexp-flags */ "./node_modules/core-js/internals/regexp-flags.js");

var TO_STRING = 'toString';
var RegExpPrototype = RegExp.prototype;
var nativeToString = RegExpPrototype[TO_STRING];

var NOT_GENERIC = fails(function () { return nativeToString.call({ source: 'a', flags: 'b' }) != '/a/b'; });
// FF44- RegExp#toString has a wrong name
var INCORRECT_NAME = nativeToString.name != TO_STRING;

// `RegExp.prototype.toString` method
// https://tc39.github.io/ecma262/#sec-regexp.prototype.tostring
if (NOT_GENERIC || INCORRECT_NAME) {
  redefine(RegExp.prototype, TO_STRING, function toString() {
    var R = anObject(this);
    var p = String(R.source);
    var rf = R.flags;
    var f = String(rf === undefined && R instanceof RegExp && !('flags' in RegExpPrototype) ? flags.call(R) : rf);
    return '/' + p + '/' + f;
  }, { unsafe: true });
}


/***/ }),

/***/ "./node_modules/core-js/modules/es.string.match.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/modules/es.string.match.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var fixRegExpWellKnownSymbolLogic = __webpack_require__(/*! ../internals/fix-regexp-well-known-symbol-logic */ "./node_modules/core-js/internals/fix-regexp-well-known-symbol-logic.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var toLength = __webpack_require__(/*! ../internals/to-length */ "./node_modules/core-js/internals/to-length.js");
var requireObjectCoercible = __webpack_require__(/*! ../internals/require-object-coercible */ "./node_modules/core-js/internals/require-object-coercible.js");
var advanceStringIndex = __webpack_require__(/*! ../internals/advance-string-index */ "./node_modules/core-js/internals/advance-string-index.js");
var regExpExec = __webpack_require__(/*! ../internals/regexp-exec-abstract */ "./node_modules/core-js/internals/regexp-exec-abstract.js");

// @@match logic
fixRegExpWellKnownSymbolLogic('match', 1, function (MATCH, nativeMatch, maybeCallNative) {
  return [
    // `String.prototype.match` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.match
    function match(regexp) {
      var O = requireObjectCoercible(this);
      var matcher = regexp == undefined ? undefined : regexp[MATCH];
      return matcher !== undefined ? matcher.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
    },
    // `RegExp.prototype[@@match]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@match
    function (regexp) {
      var res = maybeCallNative(nativeMatch, regexp, this);
      if (res.done) return res.value;

      var rx = anObject(regexp);
      var S = String(this);

      if (!rx.global) return regExpExec(rx, S);

      var fullUnicode = rx.unicode;
      rx.lastIndex = 0;
      var A = [];
      var n = 0;
      var result;
      while ((result = regExpExec(rx, S)) !== null) {
        var matchStr = String(result[0]);
        A[n] = matchStr;
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
        n++;
      }
      return n === 0 ? null : A;
    }
  ];
});


/***/ }),

/***/ "./node_modules/core-js/modules/es.string.replace.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/modules/es.string.replace.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var fixRegExpWellKnownSymbolLogic = __webpack_require__(/*! ../internals/fix-regexp-well-known-symbol-logic */ "./node_modules/core-js/internals/fix-regexp-well-known-symbol-logic.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js/internals/to-object.js");
var toLength = __webpack_require__(/*! ../internals/to-length */ "./node_modules/core-js/internals/to-length.js");
var toInteger = __webpack_require__(/*! ../internals/to-integer */ "./node_modules/core-js/internals/to-integer.js");
var requireObjectCoercible = __webpack_require__(/*! ../internals/require-object-coercible */ "./node_modules/core-js/internals/require-object-coercible.js");
var advanceStringIndex = __webpack_require__(/*! ../internals/advance-string-index */ "./node_modules/core-js/internals/advance-string-index.js");
var regExpExec = __webpack_require__(/*! ../internals/regexp-exec-abstract */ "./node_modules/core-js/internals/regexp-exec-abstract.js");

var max = Math.max;
var min = Math.min;
var floor = Math.floor;
var SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d\d?|<[^>]*>)/g;
var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d\d?)/g;

var maybeToString = function (it) {
  return it === undefined ? it : String(it);
};

// @@replace logic
fixRegExpWellKnownSymbolLogic('replace', 2, function (REPLACE, nativeReplace, maybeCallNative, reason) {
  var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = reason.REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE;
  var REPLACE_KEEPS_$0 = reason.REPLACE_KEEPS_$0;
  var UNSAFE_SUBSTITUTE = REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE ? '$' : '$0';

  return [
    // `String.prototype.replace` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.replace
    function replace(searchValue, replaceValue) {
      var O = requireObjectCoercible(this);
      var replacer = searchValue == undefined ? undefined : searchValue[REPLACE];
      return replacer !== undefined
        ? replacer.call(searchValue, O, replaceValue)
        : nativeReplace.call(String(O), searchValue, replaceValue);
    },
    // `RegExp.prototype[@@replace]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@replace
    function (regexp, replaceValue) {
      if (
        (!REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE && REPLACE_KEEPS_$0) ||
        (typeof replaceValue === 'string' && replaceValue.indexOf(UNSAFE_SUBSTITUTE) === -1)
      ) {
        var res = maybeCallNative(nativeReplace, regexp, this, replaceValue);
        if (res.done) return res.value;
      }

      var rx = anObject(regexp);
      var S = String(this);

      var functionalReplace = typeof replaceValue === 'function';
      if (!functionalReplace) replaceValue = String(replaceValue);

      var global = rx.global;
      if (global) {
        var fullUnicode = rx.unicode;
        rx.lastIndex = 0;
      }
      var results = [];
      while (true) {
        var result = regExpExec(rx, S);
        if (result === null) break;

        results.push(result);
        if (!global) break;

        var matchStr = String(result[0]);
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
      }

      var accumulatedResult = '';
      var nextSourcePosition = 0;
      for (var i = 0; i < results.length; i++) {
        result = results[i];

        var matched = String(result[0]);
        var position = max(min(toInteger(result.index), S.length), 0);
        var captures = [];
        // NOTE: This is equivalent to
        //   captures = result.slice(1).map(maybeToString)
        // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
        // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
        // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
        for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));
        var namedCaptures = result.groups;
        if (functionalReplace) {
          var replacerArgs = [matched].concat(captures, position, S);
          if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
          var replacement = String(replaceValue.apply(undefined, replacerArgs));
        } else {
          replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
        }
        if (position >= nextSourcePosition) {
          accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
          nextSourcePosition = position + matched.length;
        }
      }
      return accumulatedResult + S.slice(nextSourcePosition);
    }
  ];

  // https://tc39.github.io/ecma262/#sec-getsubstitution
  function getSubstitution(matched, str, position, captures, namedCaptures, replacement) {
    var tailPos = position + matched.length;
    var m = captures.length;
    var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
    if (namedCaptures !== undefined) {
      namedCaptures = toObject(namedCaptures);
      symbols = SUBSTITUTION_SYMBOLS;
    }
    return nativeReplace.call(replacement, symbols, function (match, ch) {
      var capture;
      switch (ch.charAt(0)) {
        case '$': return '$';
        case '&': return matched;
        case '`': return str.slice(0, position);
        case "'": return str.slice(tailPos);
        case '<':
          capture = namedCaptures[ch.slice(1, -1)];
          break;
        default: // \d\d?
          var n = +ch;
          if (n === 0) return match;
          if (n > m) {
            var f = floor(n / 10);
            if (f === 0) return match;
            if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
            return match;
          }
          capture = captures[n - 1];
      }
      return capture === undefined ? '' : capture;
    });
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/es.string.trim.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/modules/es.string.trim.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var $trim = __webpack_require__(/*! ../internals/string-trim */ "./node_modules/core-js/internals/string-trim.js").trim;
var forcedStringTrimMethod = __webpack_require__(/*! ../internals/string-trim-forced */ "./node_modules/core-js/internals/string-trim-forced.js");

// `String.prototype.trim` method
// https://tc39.github.io/ecma262/#sec-string.prototype.trim
$({ target: 'String', proto: true, forced: forcedStringTrimMethod('trim') }, {
  trim: function trim() {
    return $trim(this);
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/es.typed-array.copy-within.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/modules/es.typed-array.copy-within.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ArrayBufferViewCore = __webpack_require__(/*! ../internals/array-buffer-view-core */ "./node_modules/core-js/internals/array-buffer-view-core.js");
var $copyWithin = __webpack_require__(/*! ../internals/array-copy-within */ "./node_modules/core-js/internals/array-copy-within.js");

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.copyWithin` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.copywithin
exportTypedArrayMethod('copyWithin', function copyWithin(target, start /* , end */) {
  return $copyWithin.call(aTypedArray(this), target, start, arguments.length > 2 ? arguments[2] : undefined);
});


/***/ }),

/***/ "./node_modules/core-js/modules/es.typed-array.every.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js/modules/es.typed-array.every.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ArrayBufferViewCore = __webpack_require__(/*! ../internals/array-buffer-view-core */ "./node_modules/core-js/internals/array-buffer-view-core.js");
var $every = __webpack_require__(/*! ../internals/array-iteration */ "./node_modules/core-js/internals/array-iteration.js").every;

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.every` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.every
exportTypedArrayMethod('every', function every(callbackfn /* , thisArg */) {
  return $every(aTypedArray(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
});


/***/ }),

/***/ "./node_modules/core-js/modules/es.typed-array.fill.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/modules/es.typed-array.fill.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ArrayBufferViewCore = __webpack_require__(/*! ../internals/array-buffer-view-core */ "./node_modules/core-js/internals/array-buffer-view-core.js");
var $fill = __webpack_require__(/*! ../internals/array-fill */ "./node_modules/core-js/internals/array-fill.js");

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.fill` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.fill
// eslint-disable-next-line no-unused-vars
exportTypedArrayMethod('fill', function fill(value /* , start, end */) {
  return $fill.apply(aTypedArray(this), arguments);
});


/***/ }),

/***/ "./node_modules/core-js/modules/es.typed-array.filter.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js/modules/es.typed-array.filter.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ArrayBufferViewCore = __webpack_require__(/*! ../internals/array-buffer-view-core */ "./node_modules/core-js/internals/array-buffer-view-core.js");
var $filter = __webpack_require__(/*! ../internals/array-iteration */ "./node_modules/core-js/internals/array-iteration.js").filter;
var speciesConstructor = __webpack_require__(/*! ../internals/species-constructor */ "./node_modules/core-js/internals/species-constructor.js");

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var aTypedArrayConstructor = ArrayBufferViewCore.aTypedArrayConstructor;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.filter` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.filter
exportTypedArrayMethod('filter', function filter(callbackfn /* , thisArg */) {
  var list = $filter(aTypedArray(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  var C = speciesConstructor(this, this.constructor);
  var index = 0;
  var length = list.length;
  var result = new (aTypedArrayConstructor(C))(length);
  while (length > index) result[index] = list[index++];
  return result;
});


/***/ }),

/***/ "./node_modules/core-js/modules/es.typed-array.find-index.js":
/*!*******************************************************************!*\
  !*** ./node_modules/core-js/modules/es.typed-array.find-index.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ArrayBufferViewCore = __webpack_require__(/*! ../internals/array-buffer-view-core */ "./node_modules/core-js/internals/array-buffer-view-core.js");
var $findIndex = __webpack_require__(/*! ../internals/array-iteration */ "./node_modules/core-js/internals/array-iteration.js").findIndex;

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.findIndex` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.findindex
exportTypedArrayMethod('findIndex', function findIndex(predicate /* , thisArg */) {
  return $findIndex(aTypedArray(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
});


/***/ }),

/***/ "./node_modules/core-js/modules/es.typed-array.find.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/modules/es.typed-array.find.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ArrayBufferViewCore = __webpack_require__(/*! ../internals/array-buffer-view-core */ "./node_modules/core-js/internals/array-buffer-view-core.js");
var $find = __webpack_require__(/*! ../internals/array-iteration */ "./node_modules/core-js/internals/array-iteration.js").find;

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.find` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.find
exportTypedArrayMethod('find', function find(predicate /* , thisArg */) {
  return $find(aTypedArray(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
});


/***/ }),

/***/ "./node_modules/core-js/modules/es.typed-array.for-each.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/modules/es.typed-array.for-each.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ArrayBufferViewCore = __webpack_require__(/*! ../internals/array-buffer-view-core */ "./node_modules/core-js/internals/array-buffer-view-core.js");
var $forEach = __webpack_require__(/*! ../internals/array-iteration */ "./node_modules/core-js/internals/array-iteration.js").forEach;

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.forEach` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.foreach
exportTypedArrayMethod('forEach', function forEach(callbackfn /* , thisArg */) {
  $forEach(aTypedArray(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
});


/***/ }),

/***/ "./node_modules/core-js/modules/es.typed-array.includes.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/modules/es.typed-array.includes.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ArrayBufferViewCore = __webpack_require__(/*! ../internals/array-buffer-view-core */ "./node_modules/core-js/internals/array-buffer-view-core.js");
var $includes = __webpack_require__(/*! ../internals/array-includes */ "./node_modules/core-js/internals/array-includes.js").includes;

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.includes` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.includes
exportTypedArrayMethod('includes', function includes(searchElement /* , fromIndex */) {
  return $includes(aTypedArray(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
});


/***/ }),

/***/ "./node_modules/core-js/modules/es.typed-array.index-of.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/modules/es.typed-array.index-of.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ArrayBufferViewCore = __webpack_require__(/*! ../internals/array-buffer-view-core */ "./node_modules/core-js/internals/array-buffer-view-core.js");
var $indexOf = __webpack_require__(/*! ../internals/array-includes */ "./node_modules/core-js/internals/array-includes.js").indexOf;

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.indexOf` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.indexof
exportTypedArrayMethod('indexOf', function indexOf(searchElement /* , fromIndex */) {
  return $indexOf(aTypedArray(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
});


/***/ }),

/***/ "./node_modules/core-js/modules/es.typed-array.iterator.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/modules/es.typed-array.iterator.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var ArrayBufferViewCore = __webpack_require__(/*! ../internals/array-buffer-view-core */ "./node_modules/core-js/internals/array-buffer-view-core.js");
var ArrayIterators = __webpack_require__(/*! ../modules/es.array.iterator */ "./node_modules/core-js/modules/es.array.iterator.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");

var ITERATOR = wellKnownSymbol('iterator');
var Uint8Array = global.Uint8Array;
var arrayValues = ArrayIterators.values;
var arrayKeys = ArrayIterators.keys;
var arrayEntries = ArrayIterators.entries;
var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;
var nativeTypedArrayIterator = Uint8Array && Uint8Array.prototype[ITERATOR];

var CORRECT_ITER_NAME = !!nativeTypedArrayIterator
  && (nativeTypedArrayIterator.name == 'values' || nativeTypedArrayIterator.name == undefined);

var typedArrayValues = function values() {
  return arrayValues.call(aTypedArray(this));
};

// `%TypedArray%.prototype.entries` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.entries
exportTypedArrayMethod('entries', function entries() {
  return arrayEntries.call(aTypedArray(this));
});
// `%TypedArray%.prototype.keys` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.keys
exportTypedArrayMethod('keys', function keys() {
  return arrayKeys.call(aTypedArray(this));
});
// `%TypedArray%.prototype.values` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.values
exportTypedArrayMethod('values', typedArrayValues, !CORRECT_ITER_NAME);
// `%TypedArray%.prototype[@@iterator]` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype-@@iterator
exportTypedArrayMethod(ITERATOR, typedArrayValues, !CORRECT_ITER_NAME);


/***/ }),

/***/ "./node_modules/core-js/modules/es.typed-array.join.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/modules/es.typed-array.join.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ArrayBufferViewCore = __webpack_require__(/*! ../internals/array-buffer-view-core */ "./node_modules/core-js/internals/array-buffer-view-core.js");

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;
var $join = [].join;

// `%TypedArray%.prototype.join` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.join
// eslint-disable-next-line no-unused-vars
exportTypedArrayMethod('join', function join(separator) {
  return $join.apply(aTypedArray(this), arguments);
});


/***/ }),

/***/ "./node_modules/core-js/modules/es.typed-array.last-index-of.js":
/*!**********************************************************************!*\
  !*** ./node_modules/core-js/modules/es.typed-array.last-index-of.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ArrayBufferViewCore = __webpack_require__(/*! ../internals/array-buffer-view-core */ "./node_modules/core-js/internals/array-buffer-view-core.js");
var $lastIndexOf = __webpack_require__(/*! ../internals/array-last-index-of */ "./node_modules/core-js/internals/array-last-index-of.js");

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.lastIndexOf` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.lastindexof
// eslint-disable-next-line no-unused-vars
exportTypedArrayMethod('lastIndexOf', function lastIndexOf(searchElement /* , fromIndex */) {
  return $lastIndexOf.apply(aTypedArray(this), arguments);
});


/***/ }),

/***/ "./node_modules/core-js/modules/es.typed-array.map.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/modules/es.typed-array.map.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ArrayBufferViewCore = __webpack_require__(/*! ../internals/array-buffer-view-core */ "./node_modules/core-js/internals/array-buffer-view-core.js");
var $map = __webpack_require__(/*! ../internals/array-iteration */ "./node_modules/core-js/internals/array-iteration.js").map;
var speciesConstructor = __webpack_require__(/*! ../internals/species-constructor */ "./node_modules/core-js/internals/species-constructor.js");

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var aTypedArrayConstructor = ArrayBufferViewCore.aTypedArrayConstructor;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.map` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.map
exportTypedArrayMethod('map', function map(mapfn /* , thisArg */) {
  return $map(aTypedArray(this), mapfn, arguments.length > 1 ? arguments[1] : undefined, function (O, length) {
    return new (aTypedArrayConstructor(speciesConstructor(O, O.constructor)))(length);
  });
});


/***/ }),

/***/ "./node_modules/core-js/modules/es.typed-array.reduce-right.js":
/*!*********************************************************************!*\
  !*** ./node_modules/core-js/modules/es.typed-array.reduce-right.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ArrayBufferViewCore = __webpack_require__(/*! ../internals/array-buffer-view-core */ "./node_modules/core-js/internals/array-buffer-view-core.js");
var $reduceRight = __webpack_require__(/*! ../internals/array-reduce */ "./node_modules/core-js/internals/array-reduce.js").right;

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.reduceRicht` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.reduceright
exportTypedArrayMethod('reduceRight', function reduceRight(callbackfn /* , initialValue */) {
  return $reduceRight(aTypedArray(this), callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
});


/***/ }),

/***/ "./node_modules/core-js/modules/es.typed-array.reduce.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js/modules/es.typed-array.reduce.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ArrayBufferViewCore = __webpack_require__(/*! ../internals/array-buffer-view-core */ "./node_modules/core-js/internals/array-buffer-view-core.js");
var $reduce = __webpack_require__(/*! ../internals/array-reduce */ "./node_modules/core-js/internals/array-reduce.js").left;

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.reduce` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.reduce
exportTypedArrayMethod('reduce', function reduce(callbackfn /* , initialValue */) {
  return $reduce(aTypedArray(this), callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
});


/***/ }),

/***/ "./node_modules/core-js/modules/es.typed-array.reverse.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/modules/es.typed-array.reverse.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ArrayBufferViewCore = __webpack_require__(/*! ../internals/array-buffer-view-core */ "./node_modules/core-js/internals/array-buffer-view-core.js");

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;
var floor = Math.floor;

// `%TypedArray%.prototype.reverse` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.reverse
exportTypedArrayMethod('reverse', function reverse() {
  var that = this;
  var length = aTypedArray(that).length;
  var middle = floor(length / 2);
  var index = 0;
  var value;
  while (index < middle) {
    value = that[index];
    that[index++] = that[--length];
    that[length] = value;
  } return that;
});


/***/ }),

/***/ "./node_modules/core-js/modules/es.typed-array.set.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/modules/es.typed-array.set.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ArrayBufferViewCore = __webpack_require__(/*! ../internals/array-buffer-view-core */ "./node_modules/core-js/internals/array-buffer-view-core.js");
var toLength = __webpack_require__(/*! ../internals/to-length */ "./node_modules/core-js/internals/to-length.js");
var toOffset = __webpack_require__(/*! ../internals/to-offset */ "./node_modules/core-js/internals/to-offset.js");
var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js/internals/to-object.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

var FORCED = fails(function () {
  // eslint-disable-next-line no-undef
  new Int8Array(1).set({});
});

// `%TypedArray%.prototype.set` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.set
exportTypedArrayMethod('set', function set(arrayLike /* , offset */) {
  aTypedArray(this);
  var offset = toOffset(arguments.length > 1 ? arguments[1] : undefined, 1);
  var length = this.length;
  var src = toObject(arrayLike);
  var len = toLength(src.length);
  var index = 0;
  if (len + offset > length) throw RangeError('Wrong length');
  while (index < len) this[offset + index] = src[index++];
}, FORCED);


/***/ }),

/***/ "./node_modules/core-js/modules/es.typed-array.slice.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js/modules/es.typed-array.slice.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ArrayBufferViewCore = __webpack_require__(/*! ../internals/array-buffer-view-core */ "./node_modules/core-js/internals/array-buffer-view-core.js");
var speciesConstructor = __webpack_require__(/*! ../internals/species-constructor */ "./node_modules/core-js/internals/species-constructor.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var aTypedArrayConstructor = ArrayBufferViewCore.aTypedArrayConstructor;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;
var $slice = [].slice;

var FORCED = fails(function () {
  // eslint-disable-next-line no-undef
  new Int8Array(1).slice();
});

// `%TypedArray%.prototype.slice` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.slice
exportTypedArrayMethod('slice', function slice(start, end) {
  var list = $slice.call(aTypedArray(this), start, end);
  var C = speciesConstructor(this, this.constructor);
  var index = 0;
  var length = list.length;
  var result = new (aTypedArrayConstructor(C))(length);
  while (length > index) result[index] = list[index++];
  return result;
}, FORCED);


/***/ }),

/***/ "./node_modules/core-js/modules/es.typed-array.some.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/modules/es.typed-array.some.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ArrayBufferViewCore = __webpack_require__(/*! ../internals/array-buffer-view-core */ "./node_modules/core-js/internals/array-buffer-view-core.js");
var $some = __webpack_require__(/*! ../internals/array-iteration */ "./node_modules/core-js/internals/array-iteration.js").some;

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.some` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.some
exportTypedArrayMethod('some', function some(callbackfn /* , thisArg */) {
  return $some(aTypedArray(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
});


/***/ }),

/***/ "./node_modules/core-js/modules/es.typed-array.sort.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/modules/es.typed-array.sort.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ArrayBufferViewCore = __webpack_require__(/*! ../internals/array-buffer-view-core */ "./node_modules/core-js/internals/array-buffer-view-core.js");

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;
var $sort = [].sort;

// `%TypedArray%.prototype.sort` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.sort
exportTypedArrayMethod('sort', function sort(comparefn) {
  return $sort.call(aTypedArray(this), comparefn);
});


/***/ }),

/***/ "./node_modules/core-js/modules/es.typed-array.subarray.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/modules/es.typed-array.subarray.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ArrayBufferViewCore = __webpack_require__(/*! ../internals/array-buffer-view-core */ "./node_modules/core-js/internals/array-buffer-view-core.js");
var toLength = __webpack_require__(/*! ../internals/to-length */ "./node_modules/core-js/internals/to-length.js");
var toAbsoluteIndex = __webpack_require__(/*! ../internals/to-absolute-index */ "./node_modules/core-js/internals/to-absolute-index.js");
var speciesConstructor = __webpack_require__(/*! ../internals/species-constructor */ "./node_modules/core-js/internals/species-constructor.js");

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.subarray` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.subarray
exportTypedArrayMethod('subarray', function subarray(begin, end) {
  var O = aTypedArray(this);
  var length = O.length;
  var beginIndex = toAbsoluteIndex(begin, length);
  return new (speciesConstructor(O, O.constructor))(
    O.buffer,
    O.byteOffset + beginIndex * O.BYTES_PER_ELEMENT,
    toLength((end === undefined ? length : toAbsoluteIndex(end, length)) - beginIndex)
  );
});


/***/ }),

/***/ "./node_modules/core-js/modules/es.typed-array.to-locale-string.js":
/*!*************************************************************************!*\
  !*** ./node_modules/core-js/modules/es.typed-array.to-locale-string.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var ArrayBufferViewCore = __webpack_require__(/*! ../internals/array-buffer-view-core */ "./node_modules/core-js/internals/array-buffer-view-core.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");

var Int8Array = global.Int8Array;
var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;
var $toLocaleString = [].toLocaleString;
var $slice = [].slice;

// iOS Safari 6.x fails here
var TO_LOCALE_STRING_BUG = !!Int8Array && fails(function () {
  $toLocaleString.call(new Int8Array(1));
});

var FORCED = fails(function () {
  return [1, 2].toLocaleString() != new Int8Array([1, 2]).toLocaleString();
}) || !fails(function () {
  Int8Array.prototype.toLocaleString.call([1, 2]);
});

// `%TypedArray%.prototype.toLocaleString` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.tolocalestring
exportTypedArrayMethod('toLocaleString', function toLocaleString() {
  return $toLocaleString.apply(TO_LOCALE_STRING_BUG ? $slice.call(aTypedArray(this)) : aTypedArray(this), arguments);
}, FORCED);


/***/ }),

/***/ "./node_modules/core-js/modules/es.typed-array.to-string.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js/modules/es.typed-array.to-string.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var exportTypedArrayMethod = __webpack_require__(/*! ../internals/array-buffer-view-core */ "./node_modules/core-js/internals/array-buffer-view-core.js").exportTypedArrayMethod;
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");

var Uint8Array = global.Uint8Array;
var Uint8ArrayPrototype = Uint8Array && Uint8Array.prototype || {};
var arrayToString = [].toString;
var arrayJoin = [].join;

if (fails(function () { arrayToString.call({}); })) {
  arrayToString = function toString() {
    return arrayJoin.call(this);
  };
}

var IS_NOT_ARRAY_METHOD = Uint8ArrayPrototype.toString != arrayToString;

// `%TypedArray%.prototype.toString` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.tostring
exportTypedArrayMethod('toString', arrayToString, IS_NOT_ARRAY_METHOD);


/***/ }),

/***/ "./node_modules/core-js/modules/es.typed-array.uint8-array.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/modules/es.typed-array.uint8-array.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var createTypedArrayConstructor = __webpack_require__(/*! ../internals/typed-array-constructor */ "./node_modules/core-js/internals/typed-array-constructor.js");

// `Uint8Array` constructor
// https://tc39.github.io/ecma262/#sec-typedarray-objects
createTypedArrayConstructor('Uint8', function (init) {
  return function Uint8Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});


/***/ }),

/***/ "./node_modules/core-js/modules/web.dom-collections.for-each.js":
/*!**********************************************************************!*\
  !*** ./node_modules/core-js/modules/web.dom-collections.for-each.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var DOMIterables = __webpack_require__(/*! ../internals/dom-iterables */ "./node_modules/core-js/internals/dom-iterables.js");
var forEach = __webpack_require__(/*! ../internals/array-for-each */ "./node_modules/core-js/internals/array-for-each.js");
var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "./node_modules/core-js/internals/create-non-enumerable-property.js");

for (var COLLECTION_NAME in DOMIterables) {
  var Collection = global[COLLECTION_NAME];
  var CollectionPrototype = Collection && Collection.prototype;
  // some Chrome versions have non-configurable methods on DOMTokenList
  if (CollectionPrototype && CollectionPrototype.forEach !== forEach) try {
    createNonEnumerableProperty(CollectionPrototype, 'forEach', forEach);
  } catch (error) {
    CollectionPrototype.forEach = forEach;
  }
}


/***/ }),

/***/ "./node_modules/core-js/modules/web.timers.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/modules/web.timers.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var userAgent = __webpack_require__(/*! ../internals/engine-user-agent */ "./node_modules/core-js/internals/engine-user-agent.js");

var slice = [].slice;
var MSIE = /MSIE .\./.test(userAgent); // <- dirty ie9- check

var wrap = function (scheduler) {
  return function (handler, timeout /* , ...arguments */) {
    var boundArgs = arguments.length > 2;
    var args = boundArgs ? slice.call(arguments, 2) : undefined;
    return scheduler(boundArgs ? function () {
      // eslint-disable-next-line no-new-func
      (typeof handler == 'function' ? handler : Function(handler)).apply(this, args);
    } : handler, timeout);
  };
};

// ie9- setTimeout & setInterval additional parameters fix
// https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#timers
$({ global: true, bind: true, forced: MSIE }, {
  // `setTimeout` method
  // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-settimeout
  setTimeout: wrap(global.setTimeout),
  // `setInterval` method
  // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-setinterval
  setInterval: wrap(global.setInterval)
});


/***/ }),

/***/ "./node_modules/core-js/modules/web.url-search-params.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js/modules/web.url-search-params.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`
__webpack_require__(/*! ../modules/es.array.iterator */ "./node_modules/core-js/modules/es.array.iterator.js");
var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js/internals/get-built-in.js");
var USE_NATIVE_URL = __webpack_require__(/*! ../internals/native-url */ "./node_modules/core-js/internals/native-url.js");
var redefine = __webpack_require__(/*! ../internals/redefine */ "./node_modules/core-js/internals/redefine.js");
var redefineAll = __webpack_require__(/*! ../internals/redefine-all */ "./node_modules/core-js/internals/redefine-all.js");
var setToStringTag = __webpack_require__(/*! ../internals/set-to-string-tag */ "./node_modules/core-js/internals/set-to-string-tag.js");
var createIteratorConstructor = __webpack_require__(/*! ../internals/create-iterator-constructor */ "./node_modules/core-js/internals/create-iterator-constructor.js");
var InternalStateModule = __webpack_require__(/*! ../internals/internal-state */ "./node_modules/core-js/internals/internal-state.js");
var anInstance = __webpack_require__(/*! ../internals/an-instance */ "./node_modules/core-js/internals/an-instance.js");
var hasOwn = __webpack_require__(/*! ../internals/has */ "./node_modules/core-js/internals/has.js");
var bind = __webpack_require__(/*! ../internals/function-bind-context */ "./node_modules/core-js/internals/function-bind-context.js");
var classof = __webpack_require__(/*! ../internals/classof */ "./node_modules/core-js/internals/classof.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");
var create = __webpack_require__(/*! ../internals/object-create */ "./node_modules/core-js/internals/object-create.js");
var createPropertyDescriptor = __webpack_require__(/*! ../internals/create-property-descriptor */ "./node_modules/core-js/internals/create-property-descriptor.js");
var getIterator = __webpack_require__(/*! ../internals/get-iterator */ "./node_modules/core-js/internals/get-iterator.js");
var getIteratorMethod = __webpack_require__(/*! ../internals/get-iterator-method */ "./node_modules/core-js/internals/get-iterator-method.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");

var $fetch = getBuiltIn('fetch');
var Headers = getBuiltIn('Headers');
var ITERATOR = wellKnownSymbol('iterator');
var URL_SEARCH_PARAMS = 'URLSearchParams';
var URL_SEARCH_PARAMS_ITERATOR = URL_SEARCH_PARAMS + 'Iterator';
var setInternalState = InternalStateModule.set;
var getInternalParamsState = InternalStateModule.getterFor(URL_SEARCH_PARAMS);
var getInternalIteratorState = InternalStateModule.getterFor(URL_SEARCH_PARAMS_ITERATOR);

var plus = /\+/g;
var sequences = Array(4);

var percentSequence = function (bytes) {
  return sequences[bytes - 1] || (sequences[bytes - 1] = RegExp('((?:%[\\da-f]{2}){' + bytes + '})', 'gi'));
};

var percentDecode = function (sequence) {
  try {
    return decodeURIComponent(sequence);
  } catch (error) {
    return sequence;
  }
};

var deserialize = function (it) {
  var result = it.replace(plus, ' ');
  var bytes = 4;
  try {
    return decodeURIComponent(result);
  } catch (error) {
    while (bytes) {
      result = result.replace(percentSequence(bytes--), percentDecode);
    }
    return result;
  }
};

var find = /[!'()~]|%20/g;

var replace = {
  '!': '%21',
  "'": '%27',
  '(': '%28',
  ')': '%29',
  '~': '%7E',
  '%20': '+'
};

var replacer = function (match) {
  return replace[match];
};

var serialize = function (it) {
  return encodeURIComponent(it).replace(find, replacer);
};

var parseSearchParams = function (result, query) {
  if (query) {
    var attributes = query.split('&');
    var index = 0;
    var attribute, entry;
    while (index < attributes.length) {
      attribute = attributes[index++];
      if (attribute.length) {
        entry = attribute.split('=');
        result.push({
          key: deserialize(entry.shift()),
          value: deserialize(entry.join('='))
        });
      }
    }
  }
};

var updateSearchParams = function (query) {
  this.entries.length = 0;
  parseSearchParams(this.entries, query);
};

var validateArgumentsLength = function (passed, required) {
  if (passed < required) throw TypeError('Not enough arguments');
};

var URLSearchParamsIterator = createIteratorConstructor(function Iterator(params, kind) {
  setInternalState(this, {
    type: URL_SEARCH_PARAMS_ITERATOR,
    iterator: getIterator(getInternalParamsState(params).entries),
    kind: kind
  });
}, 'Iterator', function next() {
  var state = getInternalIteratorState(this);
  var kind = state.kind;
  var step = state.iterator.next();
  var entry = step.value;
  if (!step.done) {
    step.value = kind === 'keys' ? entry.key : kind === 'values' ? entry.value : [entry.key, entry.value];
  } return step;
});

// `URLSearchParams` constructor
// https://url.spec.whatwg.org/#interface-urlsearchparams
var URLSearchParamsConstructor = function URLSearchParams(/* init */) {
  anInstance(this, URLSearchParamsConstructor, URL_SEARCH_PARAMS);
  var init = arguments.length > 0 ? arguments[0] : undefined;
  var that = this;
  var entries = [];
  var iteratorMethod, iterator, next, step, entryIterator, entryNext, first, second, key;

  setInternalState(that, {
    type: URL_SEARCH_PARAMS,
    entries: entries,
    updateURL: function () { /* empty */ },
    updateSearchParams: updateSearchParams
  });

  if (init !== undefined) {
    if (isObject(init)) {
      iteratorMethod = getIteratorMethod(init);
      if (typeof iteratorMethod === 'function') {
        iterator = iteratorMethod.call(init);
        next = iterator.next;
        while (!(step = next.call(iterator)).done) {
          entryIterator = getIterator(anObject(step.value));
          entryNext = entryIterator.next;
          if (
            (first = entryNext.call(entryIterator)).done ||
            (second = entryNext.call(entryIterator)).done ||
            !entryNext.call(entryIterator).done
          ) throw TypeError('Expected sequence with length 2');
          entries.push({ key: first.value + '', value: second.value + '' });
        }
      } else for (key in init) if (hasOwn(init, key)) entries.push({ key: key, value: init[key] + '' });
    } else {
      parseSearchParams(entries, typeof init === 'string' ? init.charAt(0) === '?' ? init.slice(1) : init : init + '');
    }
  }
};

var URLSearchParamsPrototype = URLSearchParamsConstructor.prototype;

redefineAll(URLSearchParamsPrototype, {
  // `URLSearchParams.prototype.appent` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-append
  append: function append(name, value) {
    validateArgumentsLength(arguments.length, 2);
    var state = getInternalParamsState(this);
    state.entries.push({ key: name + '', value: value + '' });
    state.updateURL();
  },
  // `URLSearchParams.prototype.delete` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-delete
  'delete': function (name) {
    validateArgumentsLength(arguments.length, 1);
    var state = getInternalParamsState(this);
    var entries = state.entries;
    var key = name + '';
    var index = 0;
    while (index < entries.length) {
      if (entries[index].key === key) entries.splice(index, 1);
      else index++;
    }
    state.updateURL();
  },
  // `URLSearchParams.prototype.get` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-get
  get: function get(name) {
    validateArgumentsLength(arguments.length, 1);
    var entries = getInternalParamsState(this).entries;
    var key = name + '';
    var index = 0;
    for (; index < entries.length; index++) {
      if (entries[index].key === key) return entries[index].value;
    }
    return null;
  },
  // `URLSearchParams.prototype.getAll` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-getall
  getAll: function getAll(name) {
    validateArgumentsLength(arguments.length, 1);
    var entries = getInternalParamsState(this).entries;
    var key = name + '';
    var result = [];
    var index = 0;
    for (; index < entries.length; index++) {
      if (entries[index].key === key) result.push(entries[index].value);
    }
    return result;
  },
  // `URLSearchParams.prototype.has` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-has
  has: function has(name) {
    validateArgumentsLength(arguments.length, 1);
    var entries = getInternalParamsState(this).entries;
    var key = name + '';
    var index = 0;
    while (index < entries.length) {
      if (entries[index++].key === key) return true;
    }
    return false;
  },
  // `URLSearchParams.prototype.set` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-set
  set: function set(name, value) {
    validateArgumentsLength(arguments.length, 1);
    var state = getInternalParamsState(this);
    var entries = state.entries;
    var found = false;
    var key = name + '';
    var val = value + '';
    var index = 0;
    var entry;
    for (; index < entries.length; index++) {
      entry = entries[index];
      if (entry.key === key) {
        if (found) entries.splice(index--, 1);
        else {
          found = true;
          entry.value = val;
        }
      }
    }
    if (!found) entries.push({ key: key, value: val });
    state.updateURL();
  },
  // `URLSearchParams.prototype.sort` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-sort
  sort: function sort() {
    var state = getInternalParamsState(this);
    var entries = state.entries;
    // Array#sort is not stable in some engines
    var slice = entries.slice();
    var entry, entriesIndex, sliceIndex;
    entries.length = 0;
    for (sliceIndex = 0; sliceIndex < slice.length; sliceIndex++) {
      entry = slice[sliceIndex];
      for (entriesIndex = 0; entriesIndex < sliceIndex; entriesIndex++) {
        if (entries[entriesIndex].key > entry.key) {
          entries.splice(entriesIndex, 0, entry);
          break;
        }
      }
      if (entriesIndex === sliceIndex) entries.push(entry);
    }
    state.updateURL();
  },
  // `URLSearchParams.prototype.forEach` method
  forEach: function forEach(callback /* , thisArg */) {
    var entries = getInternalParamsState(this).entries;
    var boundFunction = bind(callback, arguments.length > 1 ? arguments[1] : undefined, 3);
    var index = 0;
    var entry;
    while (index < entries.length) {
      entry = entries[index++];
      boundFunction(entry.value, entry.key, this);
    }
  },
  // `URLSearchParams.prototype.keys` method
  keys: function keys() {
    return new URLSearchParamsIterator(this, 'keys');
  },
  // `URLSearchParams.prototype.values` method
  values: function values() {
    return new URLSearchParamsIterator(this, 'values');
  },
  // `URLSearchParams.prototype.entries` method
  entries: function entries() {
    return new URLSearchParamsIterator(this, 'entries');
  }
}, { enumerable: true });

// `URLSearchParams.prototype[@@iterator]` method
redefine(URLSearchParamsPrototype, ITERATOR, URLSearchParamsPrototype.entries);

// `URLSearchParams.prototype.toString` method
// https://url.spec.whatwg.org/#urlsearchparams-stringification-behavior
redefine(URLSearchParamsPrototype, 'toString', function toString() {
  var entries = getInternalParamsState(this).entries;
  var result = [];
  var index = 0;
  var entry;
  while (index < entries.length) {
    entry = entries[index++];
    result.push(serialize(entry.key) + '=' + serialize(entry.value));
  } return result.join('&');
}, { enumerable: true });

setToStringTag(URLSearchParamsConstructor, URL_SEARCH_PARAMS);

$({ global: true, forced: !USE_NATIVE_URL }, {
  URLSearchParams: URLSearchParamsConstructor
});

// Wrap `fetch` for correct work with polyfilled `URLSearchParams`
// https://github.com/zloirock/core-js/issues/674
if (!USE_NATIVE_URL && typeof $fetch == 'function' && typeof Headers == 'function') {
  $({ global: true, enumerable: true, forced: true }, {
    fetch: function fetch(input /* , init */) {
      var args = [input];
      var init, body, headers;
      if (arguments.length > 1) {
        init = arguments[1];
        if (isObject(init)) {
          body = init.body;
          if (classof(body) === URL_SEARCH_PARAMS) {
            headers = init.headers ? new Headers(init.headers) : new Headers();
            if (!headers.has('content-type')) {
              headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
            }
            init = create(init, {
              body: createPropertyDescriptor(0, String(body)),
              headers: createPropertyDescriptor(0, headers)
            });
          }
        }
        args.push(init);
      } return $fetch.apply(this, args);
    }
  });
}

module.exports = {
  URLSearchParams: URLSearchParamsConstructor,
  getState: getInternalParamsState
};


/***/ }),

/***/ "./node_modules/core-js/modules/web.url.js":
/*!*************************************************!*\
  !*** ./node_modules/core-js/modules/web.url.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`
__webpack_require__(/*! ../modules/es.string.iterator */ "./node_modules/core-js/modules/es.string.iterator.js");
var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var USE_NATIVE_URL = __webpack_require__(/*! ../internals/native-url */ "./node_modules/core-js/internals/native-url.js");
var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var defineProperties = __webpack_require__(/*! ../internals/object-define-properties */ "./node_modules/core-js/internals/object-define-properties.js");
var redefine = __webpack_require__(/*! ../internals/redefine */ "./node_modules/core-js/internals/redefine.js");
var anInstance = __webpack_require__(/*! ../internals/an-instance */ "./node_modules/core-js/internals/an-instance.js");
var has = __webpack_require__(/*! ../internals/has */ "./node_modules/core-js/internals/has.js");
var assign = __webpack_require__(/*! ../internals/object-assign */ "./node_modules/core-js/internals/object-assign.js");
var arrayFrom = __webpack_require__(/*! ../internals/array-from */ "./node_modules/core-js/internals/array-from.js");
var codeAt = __webpack_require__(/*! ../internals/string-multibyte */ "./node_modules/core-js/internals/string-multibyte.js").codeAt;
var toASCII = __webpack_require__(/*! ../internals/string-punycode-to-ascii */ "./node_modules/core-js/internals/string-punycode-to-ascii.js");
var setToStringTag = __webpack_require__(/*! ../internals/set-to-string-tag */ "./node_modules/core-js/internals/set-to-string-tag.js");
var URLSearchParamsModule = __webpack_require__(/*! ../modules/web.url-search-params */ "./node_modules/core-js/modules/web.url-search-params.js");
var InternalStateModule = __webpack_require__(/*! ../internals/internal-state */ "./node_modules/core-js/internals/internal-state.js");

var NativeURL = global.URL;
var URLSearchParams = URLSearchParamsModule.URLSearchParams;
var getInternalSearchParamsState = URLSearchParamsModule.getState;
var setInternalState = InternalStateModule.set;
var getInternalURLState = InternalStateModule.getterFor('URL');
var floor = Math.floor;
var pow = Math.pow;

var INVALID_AUTHORITY = 'Invalid authority';
var INVALID_SCHEME = 'Invalid scheme';
var INVALID_HOST = 'Invalid host';
var INVALID_PORT = 'Invalid port';

var ALPHA = /[A-Za-z]/;
var ALPHANUMERIC = /[\d+\-.A-Za-z]/;
var DIGIT = /\d/;
var HEX_START = /^(0x|0X)/;
var OCT = /^[0-7]+$/;
var DEC = /^\d+$/;
var HEX = /^[\dA-Fa-f]+$/;
// eslint-disable-next-line no-control-regex
var FORBIDDEN_HOST_CODE_POINT = /[\u0000\u0009\u000A\u000D #%/:?@[\\]]/;
// eslint-disable-next-line no-control-regex
var FORBIDDEN_HOST_CODE_POINT_EXCLUDING_PERCENT = /[\u0000\u0009\u000A\u000D #/:?@[\\]]/;
// eslint-disable-next-line no-control-regex
var LEADING_AND_TRAILING_C0_CONTROL_OR_SPACE = /^[\u0000-\u001F ]+|[\u0000-\u001F ]+$/g;
// eslint-disable-next-line no-control-regex
var TAB_AND_NEW_LINE = /[\u0009\u000A\u000D]/g;
var EOF;

var parseHost = function (url, input) {
  var result, codePoints, index;
  if (input.charAt(0) == '[') {
    if (input.charAt(input.length - 1) != ']') return INVALID_HOST;
    result = parseIPv6(input.slice(1, -1));
    if (!result) return INVALID_HOST;
    url.host = result;
  // opaque host
  } else if (!isSpecial(url)) {
    if (FORBIDDEN_HOST_CODE_POINT_EXCLUDING_PERCENT.test(input)) return INVALID_HOST;
    result = '';
    codePoints = arrayFrom(input);
    for (index = 0; index < codePoints.length; index++) {
      result += percentEncode(codePoints[index], C0ControlPercentEncodeSet);
    }
    url.host = result;
  } else {
    input = toASCII(input);
    if (FORBIDDEN_HOST_CODE_POINT.test(input)) return INVALID_HOST;
    result = parseIPv4(input);
    if (result === null) return INVALID_HOST;
    url.host = result;
  }
};

var parseIPv4 = function (input) {
  var parts = input.split('.');
  var partsLength, numbers, index, part, radix, number, ipv4;
  if (parts.length && parts[parts.length - 1] == '') {
    parts.pop();
  }
  partsLength = parts.length;
  if (partsLength > 4) return input;
  numbers = [];
  for (index = 0; index < partsLength; index++) {
    part = parts[index];
    if (part == '') return input;
    radix = 10;
    if (part.length > 1 && part.charAt(0) == '0') {
      radix = HEX_START.test(part) ? 16 : 8;
      part = part.slice(radix == 8 ? 1 : 2);
    }
    if (part === '') {
      number = 0;
    } else {
      if (!(radix == 10 ? DEC : radix == 8 ? OCT : HEX).test(part)) return input;
      number = parseInt(part, radix);
    }
    numbers.push(number);
  }
  for (index = 0; index < partsLength; index++) {
    number = numbers[index];
    if (index == partsLength - 1) {
      if (number >= pow(256, 5 - partsLength)) return null;
    } else if (number > 255) return null;
  }
  ipv4 = numbers.pop();
  for (index = 0; index < numbers.length; index++) {
    ipv4 += numbers[index] * pow(256, 3 - index);
  }
  return ipv4;
};

// eslint-disable-next-line max-statements
var parseIPv6 = function (input) {
  var address = [0, 0, 0, 0, 0, 0, 0, 0];
  var pieceIndex = 0;
  var compress = null;
  var pointer = 0;
  var value, length, numbersSeen, ipv4Piece, number, swaps, swap;

  var char = function () {
    return input.charAt(pointer);
  };

  if (char() == ':') {
    if (input.charAt(1) != ':') return;
    pointer += 2;
    pieceIndex++;
    compress = pieceIndex;
  }
  while (char()) {
    if (pieceIndex == 8) return;
    if (char() == ':') {
      if (compress !== null) return;
      pointer++;
      pieceIndex++;
      compress = pieceIndex;
      continue;
    }
    value = length = 0;
    while (length < 4 && HEX.test(char())) {
      value = value * 16 + parseInt(char(), 16);
      pointer++;
      length++;
    }
    if (char() == '.') {
      if (length == 0) return;
      pointer -= length;
      if (pieceIndex > 6) return;
      numbersSeen = 0;
      while (char()) {
        ipv4Piece = null;
        if (numbersSeen > 0) {
          if (char() == '.' && numbersSeen < 4) pointer++;
          else return;
        }
        if (!DIGIT.test(char())) return;
        while (DIGIT.test(char())) {
          number = parseInt(char(), 10);
          if (ipv4Piece === null) ipv4Piece = number;
          else if (ipv4Piece == 0) return;
          else ipv4Piece = ipv4Piece * 10 + number;
          if (ipv4Piece > 255) return;
          pointer++;
        }
        address[pieceIndex] = address[pieceIndex] * 256 + ipv4Piece;
        numbersSeen++;
        if (numbersSeen == 2 || numbersSeen == 4) pieceIndex++;
      }
      if (numbersSeen != 4) return;
      break;
    } else if (char() == ':') {
      pointer++;
      if (!char()) return;
    } else if (char()) return;
    address[pieceIndex++] = value;
  }
  if (compress !== null) {
    swaps = pieceIndex - compress;
    pieceIndex = 7;
    while (pieceIndex != 0 && swaps > 0) {
      swap = address[pieceIndex];
      address[pieceIndex--] = address[compress + swaps - 1];
      address[compress + --swaps] = swap;
    }
  } else if (pieceIndex != 8) return;
  return address;
};

var findLongestZeroSequence = function (ipv6) {
  var maxIndex = null;
  var maxLength = 1;
  var currStart = null;
  var currLength = 0;
  var index = 0;
  for (; index < 8; index++) {
    if (ipv6[index] !== 0) {
      if (currLength > maxLength) {
        maxIndex = currStart;
        maxLength = currLength;
      }
      currStart = null;
      currLength = 0;
    } else {
      if (currStart === null) currStart = index;
      ++currLength;
    }
  }
  if (currLength > maxLength) {
    maxIndex = currStart;
    maxLength = currLength;
  }
  return maxIndex;
};

var serializeHost = function (host) {
  var result, index, compress, ignore0;
  // ipv4
  if (typeof host == 'number') {
    result = [];
    for (index = 0; index < 4; index++) {
      result.unshift(host % 256);
      host = floor(host / 256);
    } return result.join('.');
  // ipv6
  } else if (typeof host == 'object') {
    result = '';
    compress = findLongestZeroSequence(host);
    for (index = 0; index < 8; index++) {
      if (ignore0 && host[index] === 0) continue;
      if (ignore0) ignore0 = false;
      if (compress === index) {
        result += index ? ':' : '::';
        ignore0 = true;
      } else {
        result += host[index].toString(16);
        if (index < 7) result += ':';
      }
    }
    return '[' + result + ']';
  } return host;
};

var C0ControlPercentEncodeSet = {};
var fragmentPercentEncodeSet = assign({}, C0ControlPercentEncodeSet, {
  ' ': 1, '"': 1, '<': 1, '>': 1, '`': 1
});
var pathPercentEncodeSet = assign({}, fragmentPercentEncodeSet, {
  '#': 1, '?': 1, '{': 1, '}': 1
});
var userinfoPercentEncodeSet = assign({}, pathPercentEncodeSet, {
  '/': 1, ':': 1, ';': 1, '=': 1, '@': 1, '[': 1, '\\': 1, ']': 1, '^': 1, '|': 1
});

var percentEncode = function (char, set) {
  var code = codeAt(char, 0);
  return code > 0x20 && code < 0x7F && !has(set, char) ? char : encodeURIComponent(char);
};

var specialSchemes = {
  ftp: 21,
  file: null,
  http: 80,
  https: 443,
  ws: 80,
  wss: 443
};

var isSpecial = function (url) {
  return has(specialSchemes, url.scheme);
};

var includesCredentials = function (url) {
  return url.username != '' || url.password != '';
};

var cannotHaveUsernamePasswordPort = function (url) {
  return !url.host || url.cannotBeABaseURL || url.scheme == 'file';
};

var isWindowsDriveLetter = function (string, normalized) {
  var second;
  return string.length == 2 && ALPHA.test(string.charAt(0))
    && ((second = string.charAt(1)) == ':' || (!normalized && second == '|'));
};

var startsWithWindowsDriveLetter = function (string) {
  var third;
  return string.length > 1 && isWindowsDriveLetter(string.slice(0, 2)) && (
    string.length == 2 ||
    ((third = string.charAt(2)) === '/' || third === '\\' || third === '?' || third === '#')
  );
};

var shortenURLsPath = function (url) {
  var path = url.path;
  var pathSize = path.length;
  if (pathSize && (url.scheme != 'file' || pathSize != 1 || !isWindowsDriveLetter(path[0], true))) {
    path.pop();
  }
};

var isSingleDot = function (segment) {
  return segment === '.' || segment.toLowerCase() === '%2e';
};

var isDoubleDot = function (segment) {
  segment = segment.toLowerCase();
  return segment === '..' || segment === '%2e.' || segment === '.%2e' || segment === '%2e%2e';
};

// States:
var SCHEME_START = {};
var SCHEME = {};
var NO_SCHEME = {};
var SPECIAL_RELATIVE_OR_AUTHORITY = {};
var PATH_OR_AUTHORITY = {};
var RELATIVE = {};
var RELATIVE_SLASH = {};
var SPECIAL_AUTHORITY_SLASHES = {};
var SPECIAL_AUTHORITY_IGNORE_SLASHES = {};
var AUTHORITY = {};
var HOST = {};
var HOSTNAME = {};
var PORT = {};
var FILE = {};
var FILE_SLASH = {};
var FILE_HOST = {};
var PATH_START = {};
var PATH = {};
var CANNOT_BE_A_BASE_URL_PATH = {};
var QUERY = {};
var FRAGMENT = {};

// eslint-disable-next-line max-statements
var parseURL = function (url, input, stateOverride, base) {
  var state = stateOverride || SCHEME_START;
  var pointer = 0;
  var buffer = '';
  var seenAt = false;
  var seenBracket = false;
  var seenPasswordToken = false;
  var codePoints, char, bufferCodePoints, failure;

  if (!stateOverride) {
    url.scheme = '';
    url.username = '';
    url.password = '';
    url.host = null;
    url.port = null;
    url.path = [];
    url.query = null;
    url.fragment = null;
    url.cannotBeABaseURL = false;
    input = input.replace(LEADING_AND_TRAILING_C0_CONTROL_OR_SPACE, '');
  }

  input = input.replace(TAB_AND_NEW_LINE, '');

  codePoints = arrayFrom(input);

  while (pointer <= codePoints.length) {
    char = codePoints[pointer];
    switch (state) {
      case SCHEME_START:
        if (char && ALPHA.test(char)) {
          buffer += char.toLowerCase();
          state = SCHEME;
        } else if (!stateOverride) {
          state = NO_SCHEME;
          continue;
        } else return INVALID_SCHEME;
        break;

      case SCHEME:
        if (char && (ALPHANUMERIC.test(char) || char == '+' || char == '-' || char == '.')) {
          buffer += char.toLowerCase();
        } else if (char == ':') {
          if (stateOverride && (
            (isSpecial(url) != has(specialSchemes, buffer)) ||
            (buffer == 'file' && (includesCredentials(url) || url.port !== null)) ||
            (url.scheme == 'file' && !url.host)
          )) return;
          url.scheme = buffer;
          if (stateOverride) {
            if (isSpecial(url) && specialSchemes[url.scheme] == url.port) url.port = null;
            return;
          }
          buffer = '';
          if (url.scheme == 'file') {
            state = FILE;
          } else if (isSpecial(url) && base && base.scheme == url.scheme) {
            state = SPECIAL_RELATIVE_OR_AUTHORITY;
          } else if (isSpecial(url)) {
            state = SPECIAL_AUTHORITY_SLASHES;
          } else if (codePoints[pointer + 1] == '/') {
            state = PATH_OR_AUTHORITY;
            pointer++;
          } else {
            url.cannotBeABaseURL = true;
            url.path.push('');
            state = CANNOT_BE_A_BASE_URL_PATH;
          }
        } else if (!stateOverride) {
          buffer = '';
          state = NO_SCHEME;
          pointer = 0;
          continue;
        } else return INVALID_SCHEME;
        break;

      case NO_SCHEME:
        if (!base || (base.cannotBeABaseURL && char != '#')) return INVALID_SCHEME;
        if (base.cannotBeABaseURL && char == '#') {
          url.scheme = base.scheme;
          url.path = base.path.slice();
          url.query = base.query;
          url.fragment = '';
          url.cannotBeABaseURL = true;
          state = FRAGMENT;
          break;
        }
        state = base.scheme == 'file' ? FILE : RELATIVE;
        continue;

      case SPECIAL_RELATIVE_OR_AUTHORITY:
        if (char == '/' && codePoints[pointer + 1] == '/') {
          state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
          pointer++;
        } else {
          state = RELATIVE;
          continue;
        } break;

      case PATH_OR_AUTHORITY:
        if (char == '/') {
          state = AUTHORITY;
          break;
        } else {
          state = PATH;
          continue;
        }

      case RELATIVE:
        url.scheme = base.scheme;
        if (char == EOF) {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          url.path = base.path.slice();
          url.query = base.query;
        } else if (char == '/' || (char == '\\' && isSpecial(url))) {
          state = RELATIVE_SLASH;
        } else if (char == '?') {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          url.path = base.path.slice();
          url.query = '';
          state = QUERY;
        } else if (char == '#') {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          url.path = base.path.slice();
          url.query = base.query;
          url.fragment = '';
          state = FRAGMENT;
        } else {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          url.path = base.path.slice();
          url.path.pop();
          state = PATH;
          continue;
        } break;

      case RELATIVE_SLASH:
        if (isSpecial(url) && (char == '/' || char == '\\')) {
          state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
        } else if (char == '/') {
          state = AUTHORITY;
        } else {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          state = PATH;
          continue;
        } break;

      case SPECIAL_AUTHORITY_SLASHES:
        state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
        if (char != '/' || buffer.charAt(pointer + 1) != '/') continue;
        pointer++;
        break;

      case SPECIAL_AUTHORITY_IGNORE_SLASHES:
        if (char != '/' && char != '\\') {
          state = AUTHORITY;
          continue;
        } break;

      case AUTHORITY:
        if (char == '@') {
          if (seenAt) buffer = '%40' + buffer;
          seenAt = true;
          bufferCodePoints = arrayFrom(buffer);
          for (var i = 0; i < bufferCodePoints.length; i++) {
            var codePoint = bufferCodePoints[i];
            if (codePoint == ':' && !seenPasswordToken) {
              seenPasswordToken = true;
              continue;
            }
            var encodedCodePoints = percentEncode(codePoint, userinfoPercentEncodeSet);
            if (seenPasswordToken) url.password += encodedCodePoints;
            else url.username += encodedCodePoints;
          }
          buffer = '';
        } else if (
          char == EOF || char == '/' || char == '?' || char == '#' ||
          (char == '\\' && isSpecial(url))
        ) {
          if (seenAt && buffer == '') return INVALID_AUTHORITY;
          pointer -= arrayFrom(buffer).length + 1;
          buffer = '';
          state = HOST;
        } else buffer += char;
        break;

      case HOST:
      case HOSTNAME:
        if (stateOverride && url.scheme == 'file') {
          state = FILE_HOST;
          continue;
        } else if (char == ':' && !seenBracket) {
          if (buffer == '') return INVALID_HOST;
          failure = parseHost(url, buffer);
          if (failure) return failure;
          buffer = '';
          state = PORT;
          if (stateOverride == HOSTNAME) return;
        } else if (
          char == EOF || char == '/' || char == '?' || char == '#' ||
          (char == '\\' && isSpecial(url))
        ) {
          if (isSpecial(url) && buffer == '') return INVALID_HOST;
          if (stateOverride && buffer == '' && (includesCredentials(url) || url.port !== null)) return;
          failure = parseHost(url, buffer);
          if (failure) return failure;
          buffer = '';
          state = PATH_START;
          if (stateOverride) return;
          continue;
        } else {
          if (char == '[') seenBracket = true;
          else if (char == ']') seenBracket = false;
          buffer += char;
        } break;

      case PORT:
        if (DIGIT.test(char)) {
          buffer += char;
        } else if (
          char == EOF || char == '/' || char == '?' || char == '#' ||
          (char == '\\' && isSpecial(url)) ||
          stateOverride
        ) {
          if (buffer != '') {
            var port = parseInt(buffer, 10);
            if (port > 0xFFFF) return INVALID_PORT;
            url.port = (isSpecial(url) && port === specialSchemes[url.scheme]) ? null : port;
            buffer = '';
          }
          if (stateOverride) return;
          state = PATH_START;
          continue;
        } else return INVALID_PORT;
        break;

      case FILE:
        url.scheme = 'file';
        if (char == '/' || char == '\\') state = FILE_SLASH;
        else if (base && base.scheme == 'file') {
          if (char == EOF) {
            url.host = base.host;
            url.path = base.path.slice();
            url.query = base.query;
          } else if (char == '?') {
            url.host = base.host;
            url.path = base.path.slice();
            url.query = '';
            state = QUERY;
          } else if (char == '#') {
            url.host = base.host;
            url.path = base.path.slice();
            url.query = base.query;
            url.fragment = '';
            state = FRAGMENT;
          } else {
            if (!startsWithWindowsDriveLetter(codePoints.slice(pointer).join(''))) {
              url.host = base.host;
              url.path = base.path.slice();
              shortenURLsPath(url);
            }
            state = PATH;
            continue;
          }
        } else {
          state = PATH;
          continue;
        } break;

      case FILE_SLASH:
        if (char == '/' || char == '\\') {
          state = FILE_HOST;
          break;
        }
        if (base && base.scheme == 'file' && !startsWithWindowsDriveLetter(codePoints.slice(pointer).join(''))) {
          if (isWindowsDriveLetter(base.path[0], true)) url.path.push(base.path[0]);
          else url.host = base.host;
        }
        state = PATH;
        continue;

      case FILE_HOST:
        if (char == EOF || char == '/' || char == '\\' || char == '?' || char == '#') {
          if (!stateOverride && isWindowsDriveLetter(buffer)) {
            state = PATH;
          } else if (buffer == '') {
            url.host = '';
            if (stateOverride) return;
            state = PATH_START;
          } else {
            failure = parseHost(url, buffer);
            if (failure) return failure;
            if (url.host == 'localhost') url.host = '';
            if (stateOverride) return;
            buffer = '';
            state = PATH_START;
          } continue;
        } else buffer += char;
        break;

      case PATH_START:
        if (isSpecial(url)) {
          state = PATH;
          if (char != '/' && char != '\\') continue;
        } else if (!stateOverride && char == '?') {
          url.query = '';
          state = QUERY;
        } else if (!stateOverride && char == '#') {
          url.fragment = '';
          state = FRAGMENT;
        } else if (char != EOF) {
          state = PATH;
          if (char != '/') continue;
        } break;

      case PATH:
        if (
          char == EOF || char == '/' ||
          (char == '\\' && isSpecial(url)) ||
          (!stateOverride && (char == '?' || char == '#'))
        ) {
          if (isDoubleDot(buffer)) {
            shortenURLsPath(url);
            if (char != '/' && !(char == '\\' && isSpecial(url))) {
              url.path.push('');
            }
          } else if (isSingleDot(buffer)) {
            if (char != '/' && !(char == '\\' && isSpecial(url))) {
              url.path.push('');
            }
          } else {
            if (url.scheme == 'file' && !url.path.length && isWindowsDriveLetter(buffer)) {
              if (url.host) url.host = '';
              buffer = buffer.charAt(0) + ':'; // normalize windows drive letter
            }
            url.path.push(buffer);
          }
          buffer = '';
          if (url.scheme == 'file' && (char == EOF || char == '?' || char == '#')) {
            while (url.path.length > 1 && url.path[0] === '') {
              url.path.shift();
            }
          }
          if (char == '?') {
            url.query = '';
            state = QUERY;
          } else if (char == '#') {
            url.fragment = '';
            state = FRAGMENT;
          }
        } else {
          buffer += percentEncode(char, pathPercentEncodeSet);
        } break;

      case CANNOT_BE_A_BASE_URL_PATH:
        if (char == '?') {
          url.query = '';
          state = QUERY;
        } else if (char == '#') {
          url.fragment = '';
          state = FRAGMENT;
        } else if (char != EOF) {
          url.path[0] += percentEncode(char, C0ControlPercentEncodeSet);
        } break;

      case QUERY:
        if (!stateOverride && char == '#') {
          url.fragment = '';
          state = FRAGMENT;
        } else if (char != EOF) {
          if (char == "'" && isSpecial(url)) url.query += '%27';
          else if (char == '#') url.query += '%23';
          else url.query += percentEncode(char, C0ControlPercentEncodeSet);
        } break;

      case FRAGMENT:
        if (char != EOF) url.fragment += percentEncode(char, fragmentPercentEncodeSet);
        break;
    }

    pointer++;
  }
};

// `URL` constructor
// https://url.spec.whatwg.org/#url-class
var URLConstructor = function URL(url /* , base */) {
  var that = anInstance(this, URLConstructor, 'URL');
  var base = arguments.length > 1 ? arguments[1] : undefined;
  var urlString = String(url);
  var state = setInternalState(that, { type: 'URL' });
  var baseState, failure;
  if (base !== undefined) {
    if (base instanceof URLConstructor) baseState = getInternalURLState(base);
    else {
      failure = parseURL(baseState = {}, String(base));
      if (failure) throw TypeError(failure);
    }
  }
  failure = parseURL(state, urlString, null, baseState);
  if (failure) throw TypeError(failure);
  var searchParams = state.searchParams = new URLSearchParams();
  var searchParamsState = getInternalSearchParamsState(searchParams);
  searchParamsState.updateSearchParams(state.query);
  searchParamsState.updateURL = function () {
    state.query = String(searchParams) || null;
  };
  if (!DESCRIPTORS) {
    that.href = serializeURL.call(that);
    that.origin = getOrigin.call(that);
    that.protocol = getProtocol.call(that);
    that.username = getUsername.call(that);
    that.password = getPassword.call(that);
    that.host = getHost.call(that);
    that.hostname = getHostname.call(that);
    that.port = getPort.call(that);
    that.pathname = getPathname.call(that);
    that.search = getSearch.call(that);
    that.searchParams = getSearchParams.call(that);
    that.hash = getHash.call(that);
  }
};

var URLPrototype = URLConstructor.prototype;

var serializeURL = function () {
  var url = getInternalURLState(this);
  var scheme = url.scheme;
  var username = url.username;
  var password = url.password;
  var host = url.host;
  var port = url.port;
  var path = url.path;
  var query = url.query;
  var fragment = url.fragment;
  var output = scheme + ':';
  if (host !== null) {
    output += '//';
    if (includesCredentials(url)) {
      output += username + (password ? ':' + password : '') + '@';
    }
    output += serializeHost(host);
    if (port !== null) output += ':' + port;
  } else if (scheme == 'file') output += '//';
  output += url.cannotBeABaseURL ? path[0] : path.length ? '/' + path.join('/') : '';
  if (query !== null) output += '?' + query;
  if (fragment !== null) output += '#' + fragment;
  return output;
};

var getOrigin = function () {
  var url = getInternalURLState(this);
  var scheme = url.scheme;
  var port = url.port;
  if (scheme == 'blob') try {
    return new URL(scheme.path[0]).origin;
  } catch (error) {
    return 'null';
  }
  if (scheme == 'file' || !isSpecial(url)) return 'null';
  return scheme + '://' + serializeHost(url.host) + (port !== null ? ':' + port : '');
};

var getProtocol = function () {
  return getInternalURLState(this).scheme + ':';
};

var getUsername = function () {
  return getInternalURLState(this).username;
};

var getPassword = function () {
  return getInternalURLState(this).password;
};

var getHost = function () {
  var url = getInternalURLState(this);
  var host = url.host;
  var port = url.port;
  return host === null ? ''
    : port === null ? serializeHost(host)
    : serializeHost(host) + ':' + port;
};

var getHostname = function () {
  var host = getInternalURLState(this).host;
  return host === null ? '' : serializeHost(host);
};

var getPort = function () {
  var port = getInternalURLState(this).port;
  return port === null ? '' : String(port);
};

var getPathname = function () {
  var url = getInternalURLState(this);
  var path = url.path;
  return url.cannotBeABaseURL ? path[0] : path.length ? '/' + path.join('/') : '';
};

var getSearch = function () {
  var query = getInternalURLState(this).query;
  return query ? '?' + query : '';
};

var getSearchParams = function () {
  return getInternalURLState(this).searchParams;
};

var getHash = function () {
  var fragment = getInternalURLState(this).fragment;
  return fragment ? '#' + fragment : '';
};

var accessorDescriptor = function (getter, setter) {
  return { get: getter, set: setter, configurable: true, enumerable: true };
};

if (DESCRIPTORS) {
  defineProperties(URLPrototype, {
    // `URL.prototype.href` accessors pair
    // https://url.spec.whatwg.org/#dom-url-href
    href: accessorDescriptor(serializeURL, function (href) {
      var url = getInternalURLState(this);
      var urlString = String(href);
      var failure = parseURL(url, urlString);
      if (failure) throw TypeError(failure);
      getInternalSearchParamsState(url.searchParams).updateSearchParams(url.query);
    }),
    // `URL.prototype.origin` getter
    // https://url.spec.whatwg.org/#dom-url-origin
    origin: accessorDescriptor(getOrigin),
    // `URL.prototype.protocol` accessors pair
    // https://url.spec.whatwg.org/#dom-url-protocol
    protocol: accessorDescriptor(getProtocol, function (protocol) {
      var url = getInternalURLState(this);
      parseURL(url, String(protocol) + ':', SCHEME_START);
    }),
    // `URL.prototype.username` accessors pair
    // https://url.spec.whatwg.org/#dom-url-username
    username: accessorDescriptor(getUsername, function (username) {
      var url = getInternalURLState(this);
      var codePoints = arrayFrom(String(username));
      if (cannotHaveUsernamePasswordPort(url)) return;
      url.username = '';
      for (var i = 0; i < codePoints.length; i++) {
        url.username += percentEncode(codePoints[i], userinfoPercentEncodeSet);
      }
    }),
    // `URL.prototype.password` accessors pair
    // https://url.spec.whatwg.org/#dom-url-password
    password: accessorDescriptor(getPassword, function (password) {
      var url = getInternalURLState(this);
      var codePoints = arrayFrom(String(password));
      if (cannotHaveUsernamePasswordPort(url)) return;
      url.password = '';
      for (var i = 0; i < codePoints.length; i++) {
        url.password += percentEncode(codePoints[i], userinfoPercentEncodeSet);
      }
    }),
    // `URL.prototype.host` accessors pair
    // https://url.spec.whatwg.org/#dom-url-host
    host: accessorDescriptor(getHost, function (host) {
      var url = getInternalURLState(this);
      if (url.cannotBeABaseURL) return;
      parseURL(url, String(host), HOST);
    }),
    // `URL.prototype.hostname` accessors pair
    // https://url.spec.whatwg.org/#dom-url-hostname
    hostname: accessorDescriptor(getHostname, function (hostname) {
      var url = getInternalURLState(this);
      if (url.cannotBeABaseURL) return;
      parseURL(url, String(hostname), HOSTNAME);
    }),
    // `URL.prototype.port` accessors pair
    // https://url.spec.whatwg.org/#dom-url-port
    port: accessorDescriptor(getPort, function (port) {
      var url = getInternalURLState(this);
      if (cannotHaveUsernamePasswordPort(url)) return;
      port = String(port);
      if (port == '') url.port = null;
      else parseURL(url, port, PORT);
    }),
    // `URL.prototype.pathname` accessors pair
    // https://url.spec.whatwg.org/#dom-url-pathname
    pathname: accessorDescriptor(getPathname, function (pathname) {
      var url = getInternalURLState(this);
      if (url.cannotBeABaseURL) return;
      url.path = [];
      parseURL(url, pathname + '', PATH_START);
    }),
    // `URL.prototype.search` accessors pair
    // https://url.spec.whatwg.org/#dom-url-search
    search: accessorDescriptor(getSearch, function (search) {
      var url = getInternalURLState(this);
      search = String(search);
      if (search == '') {
        url.query = null;
      } else {
        if ('?' == search.charAt(0)) search = search.slice(1);
        url.query = '';
        parseURL(url, search, QUERY);
      }
      getInternalSearchParamsState(url.searchParams).updateSearchParams(url.query);
    }),
    // `URL.prototype.searchParams` getter
    // https://url.spec.whatwg.org/#dom-url-searchparams
    searchParams: accessorDescriptor(getSearchParams),
    // `URL.prototype.hash` accessors pair
    // https://url.spec.whatwg.org/#dom-url-hash
    hash: accessorDescriptor(getHash, function (hash) {
      var url = getInternalURLState(this);
      hash = String(hash);
      if (hash == '') {
        url.fragment = null;
        return;
      }
      if ('#' == hash.charAt(0)) hash = hash.slice(1);
      url.fragment = '';
      parseURL(url, hash, FRAGMENT);
    })
  });
}

// `URL.prototype.toJSON` method
// https://url.spec.whatwg.org/#dom-url-tojson
redefine(URLPrototype, 'toJSON', function toJSON() {
  return serializeURL.call(this);
}, { enumerable: true });

// `URL.prototype.toString` method
// https://url.spec.whatwg.org/#URL-stringification-behavior
redefine(URLPrototype, 'toString', function toString() {
  return serializeURL.call(this);
}, { enumerable: true });

if (NativeURL) {
  var nativeCreateObjectURL = NativeURL.createObjectURL;
  var nativeRevokeObjectURL = NativeURL.revokeObjectURL;
  // `URL.createObjectURL` method
  // https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
  // eslint-disable-next-line no-unused-vars
  if (nativeCreateObjectURL) redefine(URLConstructor, 'createObjectURL', function createObjectURL(blob) {
    return nativeCreateObjectURL.apply(NativeURL, arguments);
  });
  // `URL.revokeObjectURL` method
  // https://developer.mozilla.org/en-US/docs/Web/API/URL/revokeObjectURL
  // eslint-disable-next-line no-unused-vars
  if (nativeRevokeObjectURL) redefine(URLConstructor, 'revokeObjectURL', function revokeObjectURL(url) {
    return nativeRevokeObjectURL.apply(NativeURL, arguments);
  });
}

setToStringTag(URLConstructor, 'URL');

$({ global: true, forced: !USE_NATIVE_URL, sham: !DESCRIPTORS }, {
  URL: URLConstructor
});


/***/ }),

/***/ "./node_modules/highlight.js/lib/highlight.js":
/*!****************************************************!*\
  !*** ./node_modules/highlight.js/lib/highlight.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
Syntax highlighting with language autodetection.
https://highlightjs.org/
*/

(function(factory) {

  // Find the global object for export to both the browser and web workers.
  var globalObject = typeof window === 'object' && window ||
                     typeof self === 'object' && self;

  // Setup highlight.js for different environments. First is Node.js or
  // CommonJS.
  // `nodeType` is checked to ensure that `exports` is not a HTML element.
  if( true && !exports.nodeType) {
    factory(exports);
  } else if(globalObject) {
    // Export hljs globally even when using AMD for cases when this script
    // is loaded with others that may still expect a global hljs.
    globalObject.hljs = factory({});

    // Finally register the global hljs with AMD.
    if(true) {
      !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function() {
        return globalObject.hljs;
      }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    }
  }

}(function(hljs) {
  // Convenience variables for build-in objects
  var ArrayProto = [],
      objectKeys = Object.keys;

  // Global internal variables used within the highlight.js library.
  var languages = {},
      aliases   = {};

  // safe/production mode - swallows more errors, tries to keep running
  // even if a single syntax or parse hits a fatal error
  var SAFE_MODE = true;

  // Regular expressions used throughout the highlight.js library.
  var noHighlightRe    = /^(no-?highlight|plain|text)$/i,
      languagePrefixRe = /\blang(?:uage)?-([\w-]+)\b/i,
      fixMarkupRe      = /((^(<[^>]+>|\t|)+|(?:\n)))/gm;

  // The object will be assigned by the build tool. It used to synchronize API
  // of external language files with minified version of the highlight.js library.
  var API_REPLACES;

  var spanEndTag = '</span>';
  var LANGUAGE_NOT_FOUND = "Could not find the language '{}', did you forget to load/include a language module?";

  // Global options used when within external APIs. This is modified when
  // calling the `hljs.configure` function.
  var options = {
    classPrefix: 'hljs-',
    tabReplace: null,
    useBR: false,
    languages: undefined
  };

  // keywords that should have no default relevance value
  var COMMON_KEYWORDS = 'of and for in not or if then'.split(' ');


  /* Utility functions */

  function escape(value) {
    return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function tag(node) {
    return node.nodeName.toLowerCase();
  }

  function testRe(re, lexeme) {
    var match = re && re.exec(lexeme);
    return match && match.index === 0;
  }

  function isNotHighlighted(language) {
    return noHighlightRe.test(language);
  }

  function blockLanguage(block) {
    var i, match, length, _class;
    var classes = block.className + ' ';

    classes += block.parentNode ? block.parentNode.className : '';

    // language-* takes precedence over non-prefixed class names.
    match = languagePrefixRe.exec(classes);
    if (match) {
      var language = getLanguage(match[1]);
      if (!language) {
        console.warn(LANGUAGE_NOT_FOUND.replace("{}", match[1]));
        console.warn("Falling back to no-highlight mode for this block.", block);
      }
      return language ? match[1] : 'no-highlight';
    }

    classes = classes.split(/\s+/);

    for (i = 0, length = classes.length; i < length; i++) {
      _class = classes[i];

      if (isNotHighlighted(_class) || getLanguage(_class)) {
        return _class;
      }
    }
  }

  /**
   * performs a shallow merge of multiple objects into one
   *
   * @arguments list of objects with properties to merge
   * @returns a single new object
   */
  function inherit(parent) {  // inherit(parent, override_obj, override_obj, ...)
    var key;
    var result = {};
    var objects = Array.prototype.slice.call(arguments, 1);

    for (key in parent)
      result[key] = parent[key];
    objects.forEach(function(obj) {
      for (key in obj)
        result[key] = obj[key];
    });
    return result;
  }

  /* Stream merging */

  function nodeStream(node) {
    var result = [];
    (function _nodeStream(node, offset) {
      for (var child = node.firstChild; child; child = child.nextSibling) {
        if (child.nodeType === 3)
          offset += child.nodeValue.length;
        else if (child.nodeType === 1) {
          result.push({
            event: 'start',
            offset: offset,
            node: child
          });
          offset = _nodeStream(child, offset);
          // Prevent void elements from having an end tag that would actually
          // double them in the output. There are more void elements in HTML
          // but we list only those realistically expected in code display.
          if (!tag(child).match(/br|hr|img|input/)) {
            result.push({
              event: 'stop',
              offset: offset,
              node: child
            });
          }
        }
      }
      return offset;
    })(node, 0);
    return result;
  }

  function mergeStreams(original, highlighted, value) {
    var processed = 0;
    var result = '';
    var nodeStack = [];

    function selectStream() {
      if (!original.length || !highlighted.length) {
        return original.length ? original : highlighted;
      }
      if (original[0].offset !== highlighted[0].offset) {
        return (original[0].offset < highlighted[0].offset) ? original : highlighted;
      }

      /*
      To avoid starting the stream just before it should stop the order is
      ensured that original always starts first and closes last:

      if (event1 == 'start' && event2 == 'start')
        return original;
      if (event1 == 'start' && event2 == 'stop')
        return highlighted;
      if (event1 == 'stop' && event2 == 'start')
        return original;
      if (event1 == 'stop' && event2 == 'stop')
        return highlighted;

      ... which is collapsed to:
      */
      return highlighted[0].event === 'start' ? original : highlighted;
    }

    function open(node) {
      function attr_str(a) {
        return ' ' + a.nodeName + '="' + escape(a.value).replace(/"/g, '&quot;') + '"';
      }
      result += '<' + tag(node) + ArrayProto.map.call(node.attributes, attr_str).join('') + '>';
    }

    function close(node) {
      result += '</' + tag(node) + '>';
    }

    function render(event) {
      (event.event === 'start' ? open : close)(event.node);
    }

    while (original.length || highlighted.length) {
      var stream = selectStream();
      result += escape(value.substring(processed, stream[0].offset));
      processed = stream[0].offset;
      if (stream === original) {
        /*
        On any opening or closing tag of the original markup we first close
        the entire highlighted node stack, then render the original tag along
        with all the following original tags at the same offset and then
        reopen all the tags on the highlighted stack.
        */
        nodeStack.reverse().forEach(close);
        do {
          render(stream.splice(0, 1)[0]);
          stream = selectStream();
        } while (stream === original && stream.length && stream[0].offset === processed);
        nodeStack.reverse().forEach(open);
      } else {
        if (stream[0].event === 'start') {
          nodeStack.push(stream[0].node);
        } else {
          nodeStack.pop();
        }
        render(stream.splice(0, 1)[0]);
      }
    }
    return result + escape(value.substr(processed));
  }

  /* Initialization */

  function dependencyOnParent(mode) {
    if (!mode) return false;

    return mode.endsWithParent || dependencyOnParent(mode.starts);
  }

  function expand_or_clone_mode(mode) {
    if (mode.variants && !mode.cached_variants) {
      mode.cached_variants = mode.variants.map(function(variant) {
        return inherit(mode, {variants: null}, variant);
      });
    }

    // EXPAND
    // if we have variants then essentially "replace" the mode with the variants
    // this happens in compileMode, where this function is called from
    if (mode.cached_variants)
      return mode.cached_variants;

    // CLONE
    // if we have dependencies on parents then we need a unique
    // instance of ourselves, so we can be reused with many
    // different parents without issue
    if (dependencyOnParent(mode))
      return [inherit(mode, { starts: mode.starts ? inherit(mode.starts) : null })];

    if (Object.isFrozen(mode))
      return [inherit(mode)];

    // no special dependency issues, just return ourselves
    return [mode];
  }

  function restoreLanguageApi(obj) {
    if(API_REPLACES && !obj.langApiRestored) {
      obj.langApiRestored = true;
      for(var key in API_REPLACES) {
        if (obj[key]) {
          obj[API_REPLACES[key]] = obj[key];
        }
      }
      (obj.contains || []).concat(obj.variants || []).forEach(restoreLanguageApi);
    }
  }

  function compileKeywords(rawKeywords, case_insensitive) {
      var compiled_keywords = {};

      if (typeof rawKeywords === 'string') { // string
        splitAndCompile('keyword', rawKeywords);
      } else {
        objectKeys(rawKeywords).forEach(function (className) {
          splitAndCompile(className, rawKeywords[className]);
        });
      }
    return compiled_keywords;

    // ---

    function splitAndCompile(className, str) {
      if (case_insensitive) {
        str = str.toLowerCase();
      }
      str.split(' ').forEach(function(keyword) {
        var pair = keyword.split('|');
        compiled_keywords[pair[0]] = [className, scoreForKeyword(pair[0], pair[1])];
      });
    }
  }

  function scoreForKeyword(keyword, providedScore) {
    // manual scores always win over common keywords
    // so you can force a score of 1 if you really insist
    if (providedScore)
      return Number(providedScore);

    return commonKeyword(keyword) ? 0 : 1;
  }

  function commonKeyword(word) {
    return COMMON_KEYWORDS.indexOf(word.toLowerCase()) != -1;
  }

  function compileLanguage(language) {

    function reStr(re) {
        return (re && re.source) || re;
    }

    function langRe(value, global) {
      return new RegExp(
        reStr(value),
        'm' + (language.case_insensitive ? 'i' : '') + (global ? 'g' : '')
      );
    }

    function reCountMatchGroups(re) {
      return (new RegExp(re.toString() + '|')).exec('').length - 1;
    }

    // joinRe logically computes regexps.join(separator), but fixes the
    // backreferences so they continue to match.
    // it also places each individual regular expression into it's own
    // match group, keeping track of the sequencing of those match groups
    // is currently an exercise for the caller. :-)
    function joinRe(regexps, separator) {
      // backreferenceRe matches an open parenthesis or backreference. To avoid
      // an incorrect parse, it additionally matches the following:
      // - [...] elements, where the meaning of parentheses and escapes change
      // - other escape sequences, so we do not misparse escape sequences as
      //   interesting elements
      // - non-matching or lookahead parentheses, which do not capture. These
      //   follow the '(' with a '?'.
      var backreferenceRe = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
      var numCaptures = 0;
      var ret = '';
      for (var i = 0; i < regexps.length; i++) {
        numCaptures += 1;
        var offset = numCaptures;
        var re = reStr(regexps[i]);
        if (i > 0) {
          ret += separator;
        }
        ret += "(";
        while (re.length > 0) {
          var match = backreferenceRe.exec(re);
          if (match == null) {
            ret += re;
            break;
          }
          ret += re.substring(0, match.index);
          re = re.substring(match.index + match[0].length);
          if (match[0][0] == '\\' && match[1]) {
            // Adjust the backreference.
            ret += '\\' + String(Number(match[1]) + offset);
          } else {
            ret += match[0];
            if (match[0] == '(') {
              numCaptures++;
            }
          }
        }
        ret += ")";
      }
      return ret;
    }

    function buildModeRegex(mode) {

      var matchIndexes = {};
      var matcherRe;
      var regexes = [];
      var matcher = {};
      var matchAt = 1;

      function addRule(rule, regex) {
        matchIndexes[matchAt] = rule;
        regexes.push([rule, regex]);
        matchAt += reCountMatchGroups(regex) + 1;
      }

      var term;
      for (var i=0; i < mode.contains.length; i++) {
        var re;
        term = mode.contains[i];
        if (term.beginKeywords) {
          re = '\\.?(?:' + term.begin + ')\\.?';
        } else {
          re = term.begin;
        }
        addRule(term, re);
      }
      if (mode.terminator_end)
        addRule("end", mode.terminator_end);
      if (mode.illegal)
        addRule("illegal", mode.illegal);

      var terminators = regexes.map(function(el) { return el[1]; });
      matcherRe = langRe(joinRe(terminators, '|'), true);

      matcher.lastIndex = 0;
      matcher.exec = function(s) {
        var rule;

        if( regexes.length === 0) return null;

        matcherRe.lastIndex = matcher.lastIndex;
        var match = matcherRe.exec(s);
        if (!match) { return null; }

        for(var i = 0; i<match.length; i++) {
          if (match[i] != undefined && matchIndexes["" +i] != undefined ) {
            rule = matchIndexes[""+i];
            break;
          }
        }

        // illegal or end match
        if (typeof rule === "string") {
          match.type = rule;
          match.extra = [mode.illegal, mode.terminator_end];
        } else {
          match.type = "begin";
          match.rule = rule;
        }
        return match;
      };

      return matcher;
    }

    function compileMode(mode, parent) {
      if (mode.compiled)
        return;
      mode.compiled = true;

      mode.keywords = mode.keywords || mode.beginKeywords;
      if (mode.keywords)
        mode.keywords = compileKeywords(mode.keywords, language.case_insensitive);

      mode.lexemesRe = langRe(mode.lexemes || /\w+/, true);

      if (parent) {
        if (mode.beginKeywords) {
          mode.begin = '\\b(' + mode.beginKeywords.split(' ').join('|') + ')\\b';
        }
        if (!mode.begin)
          mode.begin = /\B|\b/;
        mode.beginRe = langRe(mode.begin);
        if (mode.endSameAsBegin)
          mode.end = mode.begin;
        if (!mode.end && !mode.endsWithParent)
          mode.end = /\B|\b/;
        if (mode.end)
          mode.endRe = langRe(mode.end);
        mode.terminator_end = reStr(mode.end) || '';
        if (mode.endsWithParent && parent.terminator_end)
          mode.terminator_end += (mode.end ? '|' : '') + parent.terminator_end;
      }
      if (mode.illegal)
        mode.illegalRe = langRe(mode.illegal);
      if (mode.relevance == null)
        mode.relevance = 1;
      if (!mode.contains) {
        mode.contains = [];
      }
      mode.contains = Array.prototype.concat.apply([], mode.contains.map(function(c) {
        return expand_or_clone_mode(c === 'self' ? mode : c);
      }));
      mode.contains.forEach(function(c) {compileMode(c, mode);});

      if (mode.starts) {
        compileMode(mode.starts, parent);
      }

      mode.terminators = buildModeRegex(mode);
    }

    // self is not valid at the top-level
    if (language.contains && language.contains.indexOf('self') != -1) {
      if (!SAFE_MODE) {
        throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.")
      } else {
        // silently remove the broken rule (effectively ignoring it), this has historically
        // been the behavior in the past, so this removal preserves compatibility with broken
        // grammars when running in Safe Mode
        language.contains = language.contains.filter(function(mode) { return mode != 'self'; });
      }
    }
    compileMode(language);
  }


  /**
   * Core highlighting function.
   *
   * @param {string} languageName - the language to use for highlighting
   * @param {string} code - the code to highlight
   * @param {boolean} ignore_illegals - whether to ignore illegal matches, default is to bail
   * @param {array<mode>} continuation - array of continuation modes
   *
   * @returns an object that represents the result
   * @property {string} language - the language name
   * @property {number} relevance - the relevance score
   * @property {string} value - the highlighted HTML code
   * @property {mode} top - top of the current mode stack
   * @property {boolean} illegal - indicates whether any illegal matches were found
  */
  function highlight(languageName, code, ignore_illegals, continuation) {
    var codeToHighlight = code;

    function escapeRe(value) {
      return new RegExp(value.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'm');
    }

    function endOfMode(mode, lexeme) {
      if (testRe(mode.endRe, lexeme)) {
        while (mode.endsParent && mode.parent) {
          mode = mode.parent;
        }
        return mode;
      }
      if (mode.endsWithParent) {
        return endOfMode(mode.parent, lexeme);
      }
    }

    function keywordMatch(mode, match) {
      var match_str = language.case_insensitive ? match[0].toLowerCase() : match[0];
      return mode.keywords.hasOwnProperty(match_str) && mode.keywords[match_str];
    }

    function buildSpan(className, insideSpan, leaveOpen, noPrefix) {
      if (!leaveOpen && insideSpan === '') return '';
      if (!className) return insideSpan;

      var classPrefix = noPrefix ? '' : options.classPrefix,
          openSpan    = '<span class="' + classPrefix,
          closeSpan   = leaveOpen ? '' : spanEndTag;

      openSpan += className + '">';

      return openSpan + insideSpan + closeSpan;
    }

    function processKeywords() {
      var keyword_match, last_index, match, result;

      if (!top.keywords)
        return escape(mode_buffer);

      result = '';
      last_index = 0;
      top.lexemesRe.lastIndex = 0;
      match = top.lexemesRe.exec(mode_buffer);

      while (match) {
        result += escape(mode_buffer.substring(last_index, match.index));
        keyword_match = keywordMatch(top, match);
        if (keyword_match) {
          relevance += keyword_match[1];
          result += buildSpan(keyword_match[0], escape(match[0]));
        } else {
          result += escape(match[0]);
        }
        last_index = top.lexemesRe.lastIndex;
        match = top.lexemesRe.exec(mode_buffer);
      }
      return result + escape(mode_buffer.substr(last_index));
    }

    function processSubLanguage() {
      var explicit = typeof top.subLanguage === 'string';
      if (explicit && !languages[top.subLanguage]) {
        return escape(mode_buffer);
      }

      var result = explicit ?
                   highlight(top.subLanguage, mode_buffer, true, continuations[top.subLanguage]) :
                   highlightAuto(mode_buffer, top.subLanguage.length ? top.subLanguage : undefined);

      // Counting embedded language score towards the host language may be disabled
      // with zeroing the containing mode relevance. Use case in point is Markdown that
      // allows XML everywhere and makes every XML snippet to have a much larger Markdown
      // score.
      if (top.relevance > 0) {
        relevance += result.relevance;
      }
      if (explicit) {
        continuations[top.subLanguage] = result.top;
      }
      return buildSpan(result.language, result.value, false, true);
    }

    function processBuffer() {
      result += (top.subLanguage != null ? processSubLanguage() : processKeywords());
      mode_buffer = '';
    }

    function startNewMode(mode) {
      result += mode.className? buildSpan(mode.className, '', true): '';
      top = Object.create(mode, {parent: {value: top}});
    }


    function doBeginMatch(match) {
      var lexeme = match[0];
      var new_mode = match.rule;

      if (new_mode && new_mode.endSameAsBegin) {
        new_mode.endRe = escapeRe( lexeme );
      }

      if (new_mode.skip) {
        mode_buffer += lexeme;
      } else {
        if (new_mode.excludeBegin) {
          mode_buffer += lexeme;
        }
        processBuffer();
        if (!new_mode.returnBegin && !new_mode.excludeBegin) {
          mode_buffer = lexeme;
        }
      }
      startNewMode(new_mode);
      return new_mode.returnBegin ? 0 : lexeme.length;
    }

    function doEndMatch(match) {
      var lexeme = match[0];
      var matchPlusRemainder = codeToHighlight.substr(match.index);
      var end_mode = endOfMode(top, matchPlusRemainder);
      if (!end_mode) { return; }

      var origin = top;
      if (origin.skip) {
        mode_buffer += lexeme;
      } else {
        if (!(origin.returnEnd || origin.excludeEnd)) {
          mode_buffer += lexeme;
        }
        processBuffer();
        if (origin.excludeEnd) {
          mode_buffer = lexeme;
        }
      }
      do {
        if (top.className) {
          result += spanEndTag;
        }
        if (!top.skip && !top.subLanguage) {
          relevance += top.relevance;
        }
        top = top.parent;
      } while (top !== end_mode.parent);
      if (end_mode.starts) {
        if (end_mode.endSameAsBegin) {
          end_mode.starts.endRe = end_mode.endRe;
        }
        startNewMode(end_mode.starts);
      }
      return origin.returnEnd ? 0 : lexeme.length;
    }

    var lastMatch = {};
    function processLexeme(text_before_match, match) {

      var lexeme = match && match[0];

      // add non-matched text to the current mode buffer
      mode_buffer += text_before_match;

      if (lexeme == null) {
        processBuffer();
        return 0;
      }

      // we've found a 0 width match and we're stuck, so we need to advance
      // this happens when we have badly behaved rules that have optional matchers to the degree that
      // sometimes they can end up matching nothing at all
      // Ref: https://github.com/highlightjs/highlight.js/issues/2140
      if (lastMatch.type=="begin" && match.type=="end" && lastMatch.index == match.index && lexeme === "") {
        // spit the "skipped" character that our regex choked on back into the output sequence
        mode_buffer += codeToHighlight.slice(match.index, match.index + 1);
        return 1;
      }
      lastMatch = match;

      if (match.type==="begin") {
        return doBeginMatch(match);
      } else if (match.type==="illegal" && !ignore_illegals) {
        // illegal match, we do not continue processing
        throw new Error('Illegal lexeme "' + lexeme + '" for mode "' + (top.className || '<unnamed>') + '"');
      } else if (match.type==="end") {
        var processed = doEndMatch(match);
        if (processed != undefined)
          return processed;
      }

      /*
      Why might be find ourselves here?  Only one occasion now.  An end match that was
      triggered but could not be completed.  When might this happen?  When an `endSameasBegin`
      rule sets the end rule to a specific match.  Since the overall mode termination rule that's
      being used to scan the text isn't recompiled that means that any match that LOOKS like
      the end (but is not, because it is not an exact match to the beginning) will
      end up here.  A definite end match, but when `doEndMatch` tries to "reapply"
      the end rule and fails to match, we wind up here, and just silently ignore the end.

      This causes no real harm other than stopping a few times too many.
      */

      mode_buffer += lexeme;
      return lexeme.length;
    }

    var language = getLanguage(languageName);
    if (!language) {
      console.error(LANGUAGE_NOT_FOUND.replace("{}", languageName));
      throw new Error('Unknown language: "' + languageName + '"');
    }

    compileLanguage(language);
    var top = continuation || language;
    var continuations = {}; // keep continuations for sub-languages
    var result = '', current;
    for(current = top; current !== language; current = current.parent) {
      if (current.className) {
        result = buildSpan(current.className, '', true) + result;
      }
    }
    var mode_buffer = '';
    var relevance = 0;
    try {
      var match, count, index = 0;
      while (true) {
        top.terminators.lastIndex = index;
        match = top.terminators.exec(codeToHighlight);
        if (!match)
          break;
        count = processLexeme(codeToHighlight.substring(index, match.index), match);
        index = match.index + count;
      }
      processLexeme(codeToHighlight.substr(index));
      for(current = top; current.parent; current = current.parent) { // close dangling modes
        if (current.className) {
          result += spanEndTag;
        }
      }
      return {
        relevance: relevance,
        value: result,
        illegal:false,
        language: languageName,
        top: top
      };
    } catch (err) {
      if (err.message && err.message.indexOf('Illegal') !== -1) {
        return {
          illegal: true,
          relevance: 0,
          value: escape(codeToHighlight)
        };
      } else if (SAFE_MODE) {
        return {
          relevance: 0,
          value: escape(codeToHighlight),
          language: languageName,
          top: top,
          errorRaised: err
        };
      } else {
        throw err;
      }
    }
  }

  /*
  Highlighting with language detection. Accepts a string with the code to
  highlight. Returns an object with the following properties:

  - language (detected language)
  - relevance (int)
  - value (an HTML string with highlighting markup)
  - second_best (object with the same structure for second-best heuristically
    detected language, may be absent)

  */
  function highlightAuto(code, languageSubset) {
    languageSubset = languageSubset || options.languages || objectKeys(languages);
    var result = {
      relevance: 0,
      value: escape(code)
    };
    var second_best = result;
    languageSubset.filter(getLanguage).filter(autoDetection).forEach(function(name) {
      var current = highlight(name, code, false);
      current.language = name;
      if (current.relevance > second_best.relevance) {
        second_best = current;
      }
      if (current.relevance > result.relevance) {
        second_best = result;
        result = current;
      }
    });
    if (second_best.language) {
      result.second_best = second_best;
    }
    return result;
  }

  /*
  Post-processing of the highlighted markup:

  - replace TABs with something more useful
  - replace real line-breaks with '<br>' for non-pre containers

  */
  function fixMarkup(value) {
    if (!(options.tabReplace || options.useBR)) {
      return value;
    }

    return value.replace(fixMarkupRe, function(match, p1) {
        if (options.useBR && match === '\n') {
          return '<br>';
        } else if (options.tabReplace) {
          return p1.replace(/\t/g, options.tabReplace);
        }
        return '';
    });
  }

  function buildClassName(prevClassName, currentLang, resultLang) {
    var language = currentLang ? aliases[currentLang] : resultLang,
        result   = [prevClassName.trim()];

    if (!prevClassName.match(/\bhljs\b/)) {
      result.push('hljs');
    }

    if (prevClassName.indexOf(language) === -1) {
      result.push(language);
    }

    return result.join(' ').trim();
  }

  /*
  Applies highlighting to a DOM node containing code. Accepts a DOM node and
  two optional parameters for fixMarkup.
  */
  function highlightBlock(block) {
    var node, originalStream, result, resultNode, text;
    var language = blockLanguage(block);

    if (isNotHighlighted(language))
        return;

    if (options.useBR) {
      node = document.createElement('div');
      node.innerHTML = block.innerHTML.replace(/\n/g, '').replace(/<br[ \/]*>/g, '\n');
    } else {
      node = block;
    }
    text = node.textContent;
    result = language ? highlight(language, text, true) : highlightAuto(text);

    originalStream = nodeStream(node);
    if (originalStream.length) {
      resultNode = document.createElement('div');
      resultNode.innerHTML = result.value;
      result.value = mergeStreams(originalStream, nodeStream(resultNode), text);
    }
    result.value = fixMarkup(result.value);

    block.innerHTML = result.value;
    block.className = buildClassName(block.className, language, result.language);
    block.result = {
      language: result.language,
      re: result.relevance
    };
    if (result.second_best) {
      block.second_best = {
        language: result.second_best.language,
        re: result.second_best.relevance
      };
    }
  }

  /*
  Updates highlight.js global options with values passed in the form of an object.
  */
  function configure(user_options) {
    options = inherit(options, user_options);
  }

  /*
  Applies highlighting to all <pre><code>..</code></pre> blocks on a page.
  */
  function initHighlighting() {
    if (initHighlighting.called)
      return;
    initHighlighting.called = true;

    var blocks = document.querySelectorAll('pre code');
    ArrayProto.forEach.call(blocks, highlightBlock);
  }

  /*
  Attaches highlighting to the page load event.
  */
  function initHighlightingOnLoad() {
    window.addEventListener('DOMContentLoaded', initHighlighting, false);
    window.addEventListener('load', initHighlighting, false);
  }

  var PLAINTEXT_LANGUAGE = { disableAutodetect: true };

  function registerLanguage(name, language) {
    var lang;
    try { lang = language(hljs); }
    catch (error) {
      console.error("Language definition for '{}' could not be registered.".replace("{}", name));
      // hard or soft error
      if (!SAFE_MODE) { throw error; } else { console.error(error); }
      // languages that have serious errors are replaced with essentially a
      // "plaintext" stand-in so that the code blocks will still get normal
      // css classes applied to them - and one bad language won't break the
      // entire highlighter
      lang = PLAINTEXT_LANGUAGE;
    }
    languages[name] = lang;
    restoreLanguageApi(lang);
    lang.rawDefinition = language.bind(null,hljs);

    if (lang.aliases) {
      lang.aliases.forEach(function(alias) {aliases[alias] = name;});
    }
  }

  function listLanguages() {
    return objectKeys(languages);
  }

  /*
    intended usage: When one language truly requires another

    Unlike `getLanguage`, this will throw when the requested language
    is not available.
  */
  function requireLanguage(name) {
    var lang = getLanguage(name);
    if (lang) { return lang; }

    var err = new Error('The \'{}\' language is required, but not loaded.'.replace('{}',name));
    throw err;
  }

  function getLanguage(name) {
    name = (name || '').toLowerCase();
    return languages[name] || languages[aliases[name]];
  }

  function autoDetection(name) {
    var lang = getLanguage(name);
    return lang && !lang.disableAutodetect;
  }

  /* Interface definition */

  hljs.highlight = highlight;
  hljs.highlightAuto = highlightAuto;
  hljs.fixMarkup = fixMarkup;
  hljs.highlightBlock = highlightBlock;
  hljs.configure = configure;
  hljs.initHighlighting = initHighlighting;
  hljs.initHighlightingOnLoad = initHighlightingOnLoad;
  hljs.registerLanguage = registerLanguage;
  hljs.listLanguages = listLanguages;
  hljs.getLanguage = getLanguage;
  hljs.requireLanguage = requireLanguage;
  hljs.autoDetection = autoDetection;
  hljs.inherit = inherit;
  hljs.debugMode = function() { SAFE_MODE = false; }

  // Common regexps
  hljs.IDENT_RE = '[a-zA-Z]\\w*';
  hljs.UNDERSCORE_IDENT_RE = '[a-zA-Z_]\\w*';
  hljs.NUMBER_RE = '\\b\\d+(\\.\\d+)?';
  hljs.C_NUMBER_RE = '(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)'; // 0x..., 0..., decimal, float
  hljs.BINARY_NUMBER_RE = '\\b(0b[01]+)'; // 0b...
  hljs.RE_STARTERS_RE = '!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~';

  // Common modes
  hljs.BACKSLASH_ESCAPE = {
    begin: '\\\\[\\s\\S]', relevance: 0
  };
  hljs.APOS_STRING_MODE = {
    className: 'string',
    begin: '\'', end: '\'',
    illegal: '\\n',
    contains: [hljs.BACKSLASH_ESCAPE]
  };
  hljs.QUOTE_STRING_MODE = {
    className: 'string',
    begin: '"', end: '"',
    illegal: '\\n',
    contains: [hljs.BACKSLASH_ESCAPE]
  };
  hljs.PHRASAL_WORDS_MODE = {
    begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
  };
  hljs.COMMENT = function (begin, end, inherits) {
    var mode = hljs.inherit(
      {
        className: 'comment',
        begin: begin, end: end,
        contains: []
      },
      inherits || {}
    );
    mode.contains.push(hljs.PHRASAL_WORDS_MODE);
    mode.contains.push({
      className: 'doctag',
      begin: '(?:TODO|FIXME|NOTE|BUG|XXX):',
      relevance: 0
    });
    return mode;
  };
  hljs.C_LINE_COMMENT_MODE = hljs.COMMENT('//', '$');
  hljs.C_BLOCK_COMMENT_MODE = hljs.COMMENT('/\\*', '\\*/');
  hljs.HASH_COMMENT_MODE = hljs.COMMENT('#', '$');
  hljs.NUMBER_MODE = {
    className: 'number',
    begin: hljs.NUMBER_RE,
    relevance: 0
  };
  hljs.C_NUMBER_MODE = {
    className: 'number',
    begin: hljs.C_NUMBER_RE,
    relevance: 0
  };
  hljs.BINARY_NUMBER_MODE = {
    className: 'number',
    begin: hljs.BINARY_NUMBER_RE,
    relevance: 0
  };
  hljs.CSS_NUMBER_MODE = {
    className: 'number',
    begin: hljs.NUMBER_RE + '(' +
      '%|em|ex|ch|rem'  +
      '|vw|vh|vmin|vmax' +
      '|cm|mm|in|pt|pc|px' +
      '|deg|grad|rad|turn' +
      '|s|ms' +
      '|Hz|kHz' +
      '|dpi|dpcm|dppx' +
      ')?',
    relevance: 0
  };
  hljs.REGEXP_MODE = {
    className: 'regexp',
    begin: /\//, end: /\/[gimuy]*/,
    illegal: /\n/,
    contains: [
      hljs.BACKSLASH_ESCAPE,
      {
        begin: /\[/, end: /\]/,
        relevance: 0,
        contains: [hljs.BACKSLASH_ESCAPE]
      }
    ]
  };
  hljs.TITLE_MODE = {
    className: 'title',
    begin: hljs.IDENT_RE,
    relevance: 0
  };
  hljs.UNDERSCORE_TITLE_MODE = {
    className: 'title',
    begin: hljs.UNDERSCORE_IDENT_RE,
    relevance: 0
  };
  hljs.METHOD_GUARD = {
    // excludes method names from keyword processing
    begin: '\\.\\s*' + hljs.UNDERSCORE_IDENT_RE,
    relevance: 0
  };

  var constants = [
    hljs.BACKSLASH_ESCAPE,
    hljs.APOS_STRING_MODE,
    hljs.QUOTE_STRING_MODE,
    hljs.PHRASAL_WORDS_MODE,
    hljs.COMMENT,
    hljs.C_LINE_COMMENT_MODE,
    hljs.C_BLOCK_COMMENT_MODE,
    hljs.HASH_COMMENT_MODE,
    hljs.NUMBER_MODE,
    hljs.C_NUMBER_MODE,
    hljs.BINARY_NUMBER_MODE,
    hljs.CSS_NUMBER_MODE,
    hljs.REGEXP_MODE,
    hljs.TITLE_MODE,
    hljs.UNDERSCORE_TITLE_MODE,
    hljs.METHOD_GUARD
  ]
  constants.forEach(function(obj) { deepFreeze(obj); });

  // https://github.com/substack/deep-freeze/blob/master/index.js
  function deepFreeze (o) {
    Object.freeze(o);

    var objIsFunction = typeof o === 'function';

    Object.getOwnPropertyNames(o).forEach(function (prop) {
      if (o.hasOwnProperty(prop)
      && o[prop] !== null
      && (typeof o[prop] === "object" || typeof o[prop] === "function")
      // IE11 fix: https://github.com/highlightjs/highlight.js/issues/2318
      // TODO: remove in the future
      && (objIsFunction ? prop !== 'caller' && prop !== 'callee' && prop !== 'arguments' : true)
      && !Object.isFrozen(o[prop])) {
        deepFreeze(o[prop]);
      }
    });

    return o;
  };


  return hljs;
}));


/***/ }),

/***/ "./node_modules/highlight.js/lib/languages/php.js":
/*!********************************************************!*\
  !*** ./node_modules/highlight.js/lib/languages/php.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function(hljs) {
  var VARIABLE = {
    begin: '\\$+[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*'
  };
  var PREPROCESSOR = {
    className: 'meta', begin: /<\?(php)?|\?>/
  };
  var STRING = {
    className: 'string',
    contains: [hljs.BACKSLASH_ESCAPE, PREPROCESSOR],
    variants: [
      {
        begin: 'b"', end: '"'
      },
      {
        begin: 'b\'', end: '\''
      },
      hljs.inherit(hljs.APOS_STRING_MODE, {illegal: null}),
      hljs.inherit(hljs.QUOTE_STRING_MODE, {illegal: null})
    ]
  };
  var NUMBER = {variants: [hljs.BINARY_NUMBER_MODE, hljs.C_NUMBER_MODE]};
  return {
    aliases: ['php', 'php3', 'php4', 'php5', 'php6', 'php7'],
    case_insensitive: true,
    keywords:
      'and include_once list abstract global private echo interface as static endswitch ' +
      'array null if endwhile or const for endforeach self var while isset public ' +
      'protected exit foreach throw elseif include __FILE__ empty require_once do xor ' +
      'return parent clone use __CLASS__ __LINE__ else break print eval new ' +
      'catch __METHOD__ case exception default die require __FUNCTION__ ' +
      'enddeclare final try switch continue endfor endif declare unset true false ' +
      'trait goto instanceof insteadof __DIR__ __NAMESPACE__ ' +
      'yield finally',
    contains: [
      hljs.HASH_COMMENT_MODE,
      hljs.COMMENT('//', '$', {contains: [PREPROCESSOR]}),
      hljs.COMMENT(
        '/\\*',
        '\\*/',
        {
          contains: [
            {
              className: 'doctag',
              begin: '@[A-Za-z]+'
            }
          ]
        }
      ),
      hljs.COMMENT(
        '__halt_compiler.+?;',
        false,
        {
          endsWithParent: true,
          keywords: '__halt_compiler',
          lexemes: hljs.UNDERSCORE_IDENT_RE
        }
      ),
      {
        className: 'string',
        begin: /<<<['"]?\w+['"]?$/, end: /^\w+;?$/,
        contains: [
          hljs.BACKSLASH_ESCAPE,
          {
            className: 'subst',
            variants: [
              {begin: /\$\w+/},
              {begin: /\{\$/, end: /\}/}
            ]
          }
        ]
      },
      PREPROCESSOR,
      {
        className: 'keyword', begin: /\$this\b/
      },
      VARIABLE,
      {
        // swallow composed identifiers to avoid parsing them as keywords
        begin: /(::|->)+[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*/
      },
      {
        className: 'function',
        beginKeywords: 'function', end: /[;{]/, excludeEnd: true,
        illegal: '\\$|\\[|%',
        contains: [
          hljs.UNDERSCORE_TITLE_MODE,
          {
            className: 'params',
            begin: '\\(', end: '\\)',
            contains: [
              'self',
              VARIABLE,
              hljs.C_BLOCK_COMMENT_MODE,
              STRING,
              NUMBER
            ]
          }
        ]
      },
      {
        className: 'class',
        beginKeywords: 'class interface', end: '{', excludeEnd: true,
        illegal: /[:\(\$"]/,
        contains: [
          {beginKeywords: 'extends implements'},
          hljs.UNDERSCORE_TITLE_MODE
        ]
      },
      {
        beginKeywords: 'namespace', end: ';',
        illegal: /[\.']/,
        contains: [hljs.UNDERSCORE_TITLE_MODE]
      },
      {
        beginKeywords: 'use', end: ';',
        contains: [hljs.UNDERSCORE_TITLE_MODE]
      },
      {
        begin: '=>' // No markup, just a relevance booster
      },
      STRING,
      NUMBER
    ]
  };
};

/***/ }),

/***/ "./node_modules/highlight.js/lib/languages/twig.js":
/*!*********************************************************!*\
  !*** ./node_modules/highlight.js/lib/languages/twig.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function(hljs) {
  var PARAMS = {
    className: 'params',
    begin: '\\(', end: '\\)'
  };

  var FUNCTION_NAMES = 'attribute block constant cycle date dump include ' +
                  'max min parent random range source template_from_string';

  var FUNCTIONS = {
    beginKeywords: FUNCTION_NAMES,
    keywords: {name: FUNCTION_NAMES},
    relevance: 0,
    contains: [
      PARAMS
    ]
  };

  var FILTER = {
    begin: /\|[A-Za-z_]+:?/,
    keywords:
      'abs batch capitalize column convert_encoding date date_modify default ' +
      'escape filter first format inky_to_html inline_css join json_encode keys last ' +
      'length lower map markdown merge nl2br number_format raw reduce replace ' +
      'reverse round slice sort spaceless split striptags title trim upper url_encode',
    contains: [
      FUNCTIONS
    ]
  };

  var TAGS = 'apply autoescape block deprecated do embed extends filter flush for from ' +
    'if import include macro sandbox set use verbatim with';

  TAGS = TAGS + ' ' + TAGS.split(' ').map(function(t){return 'end' + t}).join(' ');

  return {
    aliases: ['craftcms'],
    case_insensitive: true,
    subLanguage: 'xml',
    contains: [
      hljs.COMMENT(/\{#/, /#}/),
      {
        className: 'template-tag',
        begin: /\{%/, end: /%}/,
        contains: [
          {
            className: 'name',
            begin: /\w+/,
            keywords: TAGS,
            starts: {
              endsWithParent: true,
              contains: [FILTER, FUNCTIONS],
              relevance: 0
            }
          }
        ]
      },
      {
        className: 'template-variable',
        begin: /\{\{/, end: /}}/,
        contains: ['self', FILTER, FUNCTIONS]
      }
    ]
  };
};

/***/ })

}]);