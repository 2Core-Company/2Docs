import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import {toast} from 'react-toastify'

import ErrorFirebase from './ErrorFirebase';

describe('Firebase Error Component Message Returner: ', () => {
    const error: {code: string} = {
        code: ''
    }

    test('Should return a message for Too Many Requests.', () => {
        error.code = "auth/too-many-requests";
        expect(() => ErrorFirebase(error)).toThrow('Limite de tentativas de login excedido, tente novamente mais tarde.');
    })

    test('Should return a message for Wrong Password.', () => {
        error.code = 'auth/wrong-password';        
        expect(() => ErrorFirebase(error)).toThrow('Sua senha está incorreta.');
    })

    test('Should return a message for User not Found.', () => {
        error.code = 'auth/user-not-found';        
        expect(() => ErrorFirebase(error)).toThrow('Este usuário não foi cadastrado.');
    })

    test('Should return a message for Email Already in Use.', () => {
        error.code = 'auth/email-already-in-use';        
        expect(() => ErrorFirebase(error)).toThrow('Este email ja foi cadastrado em nosso sistema.');
    })

    test('Should return a message for Email Already Exists.', () => {
        error.code = 'auth/email-already-exists';        
        expect(() => ErrorFirebase(error)).toThrow('Já existe um usuário cadastrado com este email.');
    })

    test('Should return a message for User Disabled.', () => {
        error.code = 'auth/user-disabled';        
        expect(() => ErrorFirebase(error)).toThrow('Este usuário foi desabilitado.');
    })

    test('Should return a message for Invalid Email.', () => {
        error.code = 'auth/invalid-email';        
        expect(() => ErrorFirebase(error)).toThrow('O formato de email digitado não é aceito pelo nosso sistema.');
    })
})