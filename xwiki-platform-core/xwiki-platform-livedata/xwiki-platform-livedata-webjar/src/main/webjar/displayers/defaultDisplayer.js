/*
 * See the NOTICE file distributed with this work for additional
 * information regarding copyright ownership.
 *
 * This is free software; you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as
 * published by the Free Software Foundation; either version 2.1 of
 * the License, or (at your option) any later version.
 *
 * This software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this software; if not, write to the Free
 * Software Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
 * 02110-1301 USA, or see the FSF site: http://www.fsf.org.
 */


define([
  "jquery",
], function ($) {

  /**
   * Load the displayer custom css to the page
   */
  (function loadCss(url) {
    var link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = url;
    document.getElementsByTagName("head")[0].appendChild(link);
  })(BASE_PATH + "displayers/displayers.css");


  /**
   * Create a default displayer for a property of an entry
   * @param {String} propertyId The property id of the entry to display
   * @param {Object} entryData The entry to display the property of
   * @param {Object} logic The logic object associated to the livedata
   */
  var Displayer = function (propertyId, entryData, logic) {

    this.logic = logic;
    this.propertyId = propertyId;
    this.entryData = entryData;

    this.isView = true;

    this.element = undefined;
    this.initElement();

    this.view();

  };


  /**
   * Create the root element of the displayer
   */
  Displayer.prototype.initElement = function () {
    var self = this;
    if (this.element) { return; }

    this.element = document.createElement("div");
    // set attributes
    this.element.className = "livedata-displayer";
    this.element.tabIndex = "0";
    // bind events (switching to edit mode)
    this.element.ondblclick = function () {
      if (self.isView) {
        self.edit();
      }
    };
    this.element.onkeydown = function (e) {
      if (e.keyCode === 13 /*ENTER*/ && e.target === self.element && self.isView) {
        self.edit();
      }
    };
  };


  /**
   * Return the object of parameters to be passed to the viewer and editor functions
   * @returns {Object} an object containing useful data for displayer: {
   *  value: the entry property value to be displayed
   *  property: the property descriptor object
   *  entry: the entry data object
   *  config: the configuration object of the displayer, found in the propertyDescriptor
   *  data: the livedata data object
   *  logic: the logic instance
   * }
   */
  Displayer.prototype._createParameters = function () {
    var propertyDescriptor = this.logic.getPropertyDescriptor(this.propertyId);
    // return the param object
    return {
      value: this.entryData[this.propertyId],
      property: propertyDescriptor,
      entry: this.entryData,
      config: propertyDescriptor.displayer || {},
      data: this.logic.data,
      logic: this.logic,
    };
  };



  /**
   * Create viewer element for the displayer
   * This method can be overriden by other displayers that inherit from this one
   * Parameters are given by the Displayer.prototype.view function
   * Must resolve the given promise at the end
   * @param {Object} defer A jquery promise that must be resolved when the viewer has been created
   * @param {object} params An object containing useful data for the displayer.
   *  Param object detail can be found in the Displayer.prototype._createParameters method
   */
  Displayer.prototype.createView = function (defer, params) {
    var element = document.createElement("div");
    if (params.value !== undefined && params.value !== null) {
      element.innerText = params.value;
    }
    defer.resolve(element);
  };



  /**
   * Create editor element for the displayer
   * This method can be overriden by other displayers that inherit from this one
   * Parameters are given by the Displayer.prototype.edit function
   * Must resolve the given promise at the end
   * @param {Object} defer A jquery promise that must be resolved when the editor has been created
   * @param {object} params An object containing useful data for the displayer.
   *  Param object detail can be found in the Displayer.prototype._createParameters method
   */
  Displayer.prototype.createEdit = function (defer, params) {
    var self = this;
    var input = document.createElement("input");
    input.size = 1;
    input.style.width = "100%";
    if (params.value !== undefined && params.value !== null) {
      input.value = params.value;
    }
    input.focus();

    // validate / abort changes
    input.onfocusout = function () {
      self.applyEdit(input.value);
    };
    input.onkeydown = function (e) {
      if (e.keyCode === 13 /*ENTER*/) {
        self.applyEdit(input.value);
      }
      if (e.keyCode === 27 /*ESCAPE*/) {
        self.abortEdit();
      }
    };
    defer.resolve(input);
  };


  Displayer.prototype.applyEdit = function (newValue) {
    // should call a logic API instead, but this is just for quick prove of concept
    this.entryData[this.propertyId] = newValue;
    this.view();
    this.element.focus();
  };
  Displayer.prototype.abortEdit = function () {
    this.view();
    this.element.focus();
  };


  /**
   * Call this.createView and append viewer to the displayer root element
   */
  Displayer.prototype.view = function () {
    var self = this;
    var defer = $.Deferred();
    var params = this._createParameters();

    this.createView(defer, params);
    defer.done(function (element) {
      self.element.innerHTML = "";
      self.element.appendChild(element);
    });

    this.isView = true;
    this.element.classList.remove("edit");
    this.element.classList.add("view");
  };

  /**
   * Call this.createEdit and append editor to the displayer root element
   */
  Displayer.prototype.edit = function () {
    var self = this;
    var defer = $.Deferred();
    var params = this._createParameters();

    this.createEdit(defer, params);
    defer.done(function (element) {
      self.element.innerHTML = "";
      self.element.appendChild(element);
      element.focus();
    });

    this.isView = false;
    this.element.classList.remove("view");
    this.element.classList.add("edit");
  };



  return Displayer;

});
