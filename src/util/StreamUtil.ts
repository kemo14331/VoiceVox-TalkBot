import { Readable } from 'stream';

/**
 * バッファをReadableに変換する
 *
 * @param {Buffer} buffer
 * @return {Readable}
 */
export function bufferToStream(buffer: Buffer): Readable {
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    return stream;
}
