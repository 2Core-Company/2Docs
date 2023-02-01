import "@testing-library/jest-dom";
import { describe, expect, test } from "vitest";

import { cnpjMask, AlterPassword, AlterPasswordCnpj } from ".";

describe('Cnpj Mask Tests: ', () => {
    test('Should not be able to add anything than numbers in input and should return formatted.', () => {
        expect(cnpjMask('abc71234567dgh910234')).toBe('71.234.567/9102-34');
    })    
})

describe('AlterPassword Tests: ', () => {
    test('Should not be able to alter a password with email using a null value email.', () => {
        expect(() => AlterPassword('')).toThrow('Email value should be filled to proceed.');
    })
    test('Should not be able to alter a password with cnpj using a null value email.', async () => {
        const e = await Promise.resolve(AlterPasswordCnpj(''));
        expect(e).toBe('CNPJ value should be filled to proceed.');
    })
})