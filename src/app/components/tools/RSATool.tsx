import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

function arrayBufferToBase64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary);
}

function base64ToArrayBuffer(base64: string) {
  const binary = atob(base64.replace(/\s+/g, ''));
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes.buffer;
}

function toPem(base64: string, label: string) {
  const rows = base64.match(/.{1,64}/g)?.join('\n') ?? base64;
  return `-----BEGIN ${label}-----\n${rows}\n-----END ${label}-----`;
}

function extractPemBody(pem: string) {
  return pem.replace(/-----BEGIN [^-]+-----/g, '').replace(/-----END [^-]+-----/g, '').replace(/\s+/g, '');
}

async function exportPublicKey(key: CryptoKey) {
  const exported = await crypto.subtle.exportKey('spki', key);
  return toPem(arrayBufferToBase64(exported), 'PUBLIC KEY');
}

async function exportPrivateKey(key: CryptoKey) {
  const exported = await crypto.subtle.exportKey('pkcs8', key);
  return toPem(arrayBufferToBase64(exported), 'PRIVATE KEY');
}

async function importPublicKey(pem: string) {
  return crypto.subtle.importKey(
    'spki',
    base64ToArrayBuffer(extractPemBody(pem)),
    { name: 'RSA-OAEP', hash: 'SHA-256' },
    true,
    ['encrypt']
  );
}

async function importPrivateKey(pem: string) {
  return crypto.subtle.importKey(
    'pkcs8',
    base64ToArrayBuffer(extractPemBody(pem)),
    { name: 'RSA-OAEP', hash: 'SHA-256' },
    true,
    ['decrypt']
  );
}

export function RSATool() {
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [publicKeyPem, setPublicKeyPem] = useState('');
  const [privateKeyPem, setPrivateKeyPem] = useState('');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState('浏览器端使用 RSA-OAEP 2048 / SHA-256');
  const [copied, setCopied] = useState('');

  const handleCopy = (value: string, key: string) => {
    navigator.clipboard.writeText(value);
    setCopied(key);
    setTimeout(() => setCopied(''), 2000);
  };

  const handleGenerateKeys = async () => {
    try {
      const keyPair = await crypto.subtle.generateKey(
        {
          name: 'RSA-OAEP',
          modulusLength: 2048,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: 'SHA-256',
        },
        true,
        ['encrypt', 'decrypt']
      );

      const [nextPublicKey, nextPrivateKey] = await Promise.all([
        exportPublicKey(keyPair.publicKey),
        exportPrivateKey(keyPair.privateKey),
      ]);

      setPublicKeyPem(nextPublicKey);
      setPrivateKeyPem(nextPrivateKey);
      setStatus('已生成新的 RSA 密钥对');
    } catch (error) {
      setStatus('生成密钥失败，请确认当前环境支持 Web Crypto API');
    }
  };

  const handleProcess = async () => {
    if (!input.trim()) {
      return;
    }

    try {
      if (mode === 'encrypt') {
        if (!publicKeyPem.trim()) {
          throw new Error('请先提供公钥');
        }

        const importedPublicKey = await importPublicKey(publicKeyPem);
        const encrypted = await crypto.subtle.encrypt(
          { name: 'RSA-OAEP' },
          importedPublicKey,
          new TextEncoder().encode(input)
        );

        setOutput(arrayBufferToBase64(encrypted));
        setStatus('加密成功');
      } else {
        if (!privateKeyPem.trim()) {
          throw new Error('请先提供私钥');
        }

        const importedPrivateKey = await importPrivateKey(privateKeyPem);
        const decrypted = await crypto.subtle.decrypt(
          { name: 'RSA-OAEP' },
          importedPrivateKey,
          base64ToArrayBuffer(input)
        );

        setOutput(new TextDecoder().decode(decrypted));
        setStatus('解密成功');
      }
    } catch (error) {
      setOutput('');
      setStatus(error instanceof Error ? error.message : 'RSA 处理失败');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div>
            <h3 className="font-semibold text-gray-900">密钥管理</h3>
            <p className="text-sm text-gray-500 mt-1">当前实现适合短文本场景，不适合直接加密大文件。</p>
          </div>
          <button
            onClick={handleGenerateKeys}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            生成密钥对
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">公钥</label>
              {publicKeyPem && (
                <button
                  onClick={() => handleCopy(publicKeyPem, 'public')}
                  className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
                >
                  {copied === 'public' ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                  复制
                </button>
              )}
            </div>
            <textarea
              value={publicKeyPem}
              onChange={(e) => setPublicKeyPem(e.target.value)}
              placeholder="-----BEGIN PUBLIC KEY-----"
              className="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">私钥</label>
              {privateKeyPem && (
                <button
                  onClick={() => handleCopy(privateKeyPem, 'private')}
                  className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
                >
                  {copied === 'private' ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                  复制
                </button>
              )}
            </div>
            <textarea
              value={privateKeyPem}
              onChange={(e) => setPrivateKeyPem(e.target.value)}
              placeholder="-----BEGIN PRIVATE KEY-----"
              className="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setMode('encrypt')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              mode === 'encrypt' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            加密
          </button>
          <button
            onClick={() => setMode('decrypt')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              mode === 'decrypt' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            解密
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {mode === 'encrypt' ? '待加密文本' : 'Base64 密文'}
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === 'encrypt' ? '请输入短文本...' : '请输入 Base64 密文...'}
              className="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">输出结果</label>
              {output && (
                <button
                  onClick={() => handleCopy(output, 'output')}
                  className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
                >
                  {copied === 'output' ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                  复制
                </button>
              )}
            </div>
            <div className="h-48 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg overflow-auto whitespace-pre-wrap break-all font-mono text-sm">
              {output || '处理结果将显示在这里...'}
            </div>
          </div>
        </div>

        <button
          onClick={handleProcess}
          className="w-full py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium"
        >
          {mode === 'encrypt' ? '执行加密' : '执行解密'}
        </button>

        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
          {status}
        </div>
      </div>
    </div>
  );
}
