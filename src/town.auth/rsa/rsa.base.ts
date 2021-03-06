import { Injectable } from "@nestjs/common";
import * as NodeRsa from 'node-rsa';
import { rsa_config } from "@town/application/constant";
import { UtilService } from "@town/town.util/town.util";

@Injectable()
export class RsaBase {

  constructor(
    private readonly util: UtilService
  ) {
  }

  // 获取密钥对
  getRsaKeyPair() {
    // 创建rsa对象，指定密钥长度
    const nodeRsa = new NodeRsa({ b: rsa_config.len });
    // 设置加密格式
    nodeRsa.setOptions({ encryptionScheme: 'pkcs1' });
    // 生成公钥
    const [publicPem, privatePem] = [
      this.util.setEncryptBase64(nodeRsa.exportKey('pkcs1-public-pem')),
      this.util.setEncryptBase64(nodeRsa.exportKey('pkcs1-private-pem'))
    ];
    return [publicPem, privatePem];
  }

  // 使用私钥解密base64获取公钥
  decodePublickKey(frontPass: string, privateKey: string) {
    const nodeRsa = new NodeRsa(privateKey);
    nodeRsa.importKey(privateKey);
    const password = nodeRsa.decrypt(frontPass, 'utf8');
    return password;
  }

}