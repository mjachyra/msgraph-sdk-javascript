/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

/**
 * @module MiddlewareControl
 */

import { assert } from "chai";
import "isomorphic-fetch";

import { MiddlewareControl } from "../../src/middleware/MiddlewareControl";
import { DummyHandlerOption } from "../DummyHandlerOption";

describe("MiddlewareControl.ts", () => {
	const dummyHandlerOption = new DummyHandlerOption();
	/* tslint:disable: no-string-literal*/
	describe("constructor", () => {
		it("Should populate its middleware options map", () => {
			const middlewareControl = new MiddlewareControl([dummyHandlerOption]);
			assert.isDefined(middlewareControl["middlewareOptions"]);
			assert.equal(middlewareControl["middlewareOptions"].size, 1);
		});

		it("Should create empty middleware options map for empty middleware options array", () => {
			const middlewareControl = new MiddlewareControl([]);
			assert.isDefined(middlewareControl["middlewareOptions"]);
			assert.equal(middlewareControl["middlewareOptions"].size, 0);
		});
	});
	/* tslint:enable: no-string-literal*/

	describe("getMiddlewareOption", () => {
		it("Should return the middleware option for a given class name", () => {
			const middlewareControl = new MiddlewareControl([dummyHandlerOption]);
			const retryOption: DummyHandlerOption = middlewareControl.getMiddlewareOption(dummyHandlerOption.constructor.name) as DummyHandlerOption;
			assert.isDefined(retryOption);
			assert.equal(dummyHandlerOption, retryOption);
		});

		it("Should return undefined for unknown class name", () => {
			const middlewareControl = new MiddlewareControl([dummyHandlerOption]);
			const retryOption = middlewareControl.getMiddlewareOption("NotAvailableHandlerOption");
			assert.isUndefined(retryOption);
		});
	});
});
