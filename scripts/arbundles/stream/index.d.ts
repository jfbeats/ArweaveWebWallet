/// <reference types="node" />
import { Readable } from "stream";
export default function processStream(stream: Readable): Promise<Record<string, any>[]>;
