import axios, { AxiosRequestConfig } from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

let url = 'https://api-na.playground.klarna.com';
let token = `${Buffer.from(`${process.env.KLARNA_USERNAME}:${process.env.KLARNA_PASSWORD}`).toString('base64')}`;


export default class KlarnaApi {
  public host = url;
  public token = token;

  async get(params: string) {
    try {
      let config: AxiosRequestConfig = {
        method: 'get',
        url: `${this.host}${params}`,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Basic ${this.token}`,
        },
      };
      let api = await axios(config);
      return api.data;
    } catch (error) {
      console.log(error);

      return error;
    }
  }

  async delete(params: string) {
    try {
      let config: AxiosRequestConfig = {
        method: 'delete',
        url: `${this.host}${params}`,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Basic ${this.token}`,
        },
      };
      let api = await axios(config);
      return api.data;
    } catch (error) {
      console.log(error);

      return error;
    }
  }

  async post(params: string, body: any) {
    try {
      let config: AxiosRequestConfig = {
        method: 'post',
        url: `${this.host}${params}`,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Basic ${this.token}`,
        },
        data: body,
      };

      let api = await axios(config);
      //   console.log(api)
      return api.data;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async put(params: string, body: any) {
    try {
      let config: AxiosRequestConfig = {
        method: 'put',
        url: `${this.host}${params}`,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Basic ${this.token}`,
        },
        data: body,
      };

      let api = await axios(config);
      return api.data;
    } catch (error) {
      // console.log(error)
      return error;
    }
  }

  async patch(params: string, body: any) {
    try {
      let config: AxiosRequestConfig = {
        method: 'patch',
        url: `${this.host}${params}`,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Basic ${this.token}`,
        },
        data: body,
      };

      let api = await axios(config);
      return api.data;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
