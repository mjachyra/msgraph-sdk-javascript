/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import { assert } from "chai";

import { Client } from "../../src/index";
import { PageIterator, PageIteratorCallback } from "../../src/tasks/PageIterator";
import { getClient } from "../test-helper";

const client: Client = getClient();

const value = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const getPageCollection = () => {
	return {
		value: [...value],
		additionalContent: "additional content",
	};
};

const getPageCollectionWithNext = () => {
	return {
		value: [...value],
		"@odata.nextLink": "nextURL",
		additionalContent: "additional content",
	};
};

const getEmptyPageCollection = () => {
	return {
		value: [],
	};
};

const getEmptyPageCollectionWithNext = () => {
	return {
		value: [],
		"@odata.nextLink": "nextURL",
	};
};

const truthyCallback: PageIteratorCallback = (data) => {
	return true;
};

let truthyCallbackCounter = 5;
const truthyCallbackWithCounter: PageIteratorCallback = (data) => {
	truthyCallbackCounter--;
	return true;
};

let halfWayCallbackCounter = 5;
const halfWayCallback: PageIteratorCallback = (data) => {
	halfWayCallbackCounter--;
	if (halfWayCallbackCounter === 0) {
		return false;
	} else {
		return true;
	}
};

describe("PageIterator.ts", () => {
	describe("Constructor", () => {
		it("Should create instance without nextLink", () => {
			const pageIterator = new PageIterator(client, getPageCollection(), truthyCallback);
			assert.equal(pageIterator.constructor.name, "PageIterator");
		});

		it("Should create instance with nextLink", () => {
			const pageIterator = new PageIterator(client, getPageCollectionWithNext(), truthyCallback);
			assert.equal(pageIterator.constructor.name, "PageIterator");
		});
	});

	describe("iterate", () => {
		it("Should iterate over a complete collection without nextLink", async () => {
			truthyCallbackCounter = 10;
			const pageIterator = new PageIterator(client, getPageCollection(), truthyCallbackWithCounter);
			try {
				await pageIterator.iterate();
				assert.equal(truthyCallbackCounter, 0);
			} catch (error) {
				throw error;
			}
		});

		it("Should not iterate over an empty collection", async () => {
			const pageIterator = new PageIterator(client, getEmptyPageCollection(), truthyCallback);
			halfWayCallbackCounter = 1;
			try {
				await pageIterator.iterate();
				assert.equal(halfWayCallbackCounter, 1);
			} catch (error) {
				throw error;
			}
		});

		it("Should break in the middle way", async () => {
			const pageIterator = new PageIterator(client, getPageCollection(), halfWayCallback);
			halfWayCallbackCounter = 5;
			try {
				await pageIterator.iterate();
				assert.equal(halfWayCallbackCounter, 0);
			} catch (error) {
				throw error;
			}
		});
	});

	/* tslint:disable: no-string-literal*/
	describe("iterationHelper", () => {
		it("Should return true for empty collection with next link", () => {
			const pageIterator = new PageIterator(client, getEmptyPageCollectionWithNext(), truthyCallback);
			try {
				const advance = pageIterator["iterationHelper"]();
				assert.isTrue(advance);
			} catch (error) {
				throw error;
			}
		});
	});
	/* tslint:enable: no-string-literal*/

	describe("resume", () => {
		it("Should start from the place where it left the iteration", async () => {
			const pageIterator = new PageIterator(client, getPageCollection(), halfWayCallback);
			halfWayCallbackCounter = 5;
			try {
				await pageIterator.iterate();
				assert.equal(halfWayCallbackCounter, 0);
				halfWayCallbackCounter = 5;
				await pageIterator.resume();
				assert.equal(halfWayCallbackCounter, 0);
			} catch (error) {
				throw error;
			}
		});
	});
});
