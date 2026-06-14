import { describe, test, expect } from "vitest";
import { helloTHM } from "../src";

describe("Helpers default tests", () => {
    test("1+1=2", () => {
        expect(1 + 1).toBe(2);
    })

    test("helloTHM function returns 'Hello THM!'", () => {
        expect(helloTHM()).toBe("Hello THM!");
    })
})