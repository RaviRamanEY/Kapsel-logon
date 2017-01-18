/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2016 SAP SE. All rights reserved
 */
sap.ui.define([],function(){"use strict";var _={color:true,color2:true};function S(){this._mSeriesColor={};}function s(c){var t=jQuery.type(c);switch(t){case"string":return'"'+c+'"';case"null":case"undefined":return t;case"array":return"["+c.map(s).join(",")+"]";case"object":return"{"+Object.keys(c).map(function(p){return'"'+p+'":'+s(c[p]);}).join(",")+"}";case"number":case"boolean":return String(c);default:return t+"<"+String(c)+">";}}S.prototype.add=function(r){var a=this._mSeriesColor,m;r.forEach(function(R){var f=R.feed;if(!_[f]){return;}m=a[f];if(!m){m={};a[f]=m;}R.results.forEach(function(o){var k=s(o.dataContext);if(!m[k]){m[k]=o;}});});};S.prototype.get=function(){var f=Object.keys(this._mSeriesColor);var m=this._mSeriesColor;return f.map(function(F){var k=Object.keys(m[F]);return k.length===0?null:{results:k.map(function(K){return m[F][K];}),feed:F};});};S.prototype.clear=function(){this._mSeriesColor={};};return S;});
