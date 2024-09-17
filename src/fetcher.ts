import { JSDOM } from 'jsdom';

interface ResultDict {
    [key: string]: ResultDict | string | ResultDict[];
}

export async function fetchCleanContent(url: string): Promise<any> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch content from ${url}: ${response.statusText}`);
  }

  const html = await response.text();
  const dom = new JSDOM(html);
  const body = dom.window.document.querySelector('body');

  const contentDict = body ? elementToDict(body) : elementToDict(dom.window.document.documentElement);
  return pruneEmpty(contentDict);
}

function elementToDict(element: Element): any {
    const result: any = {};
  
    // Process each child node
    for (const child of element.children) {
      const nodeName = child.nodeName.toLowerCase();
      
      // Skip script elements
      if (nodeName === 'script') continue;
  
      // Recursively convert child elements to dictionary
      const childDict = elementToDict(child);
  
      // If the result already has an entry for this nodeName, convert it to an array if necessary
      if (result[nodeName]) {
        if (!Array.isArray(result[nodeName])) {
          result[nodeName] = [result[nodeName]];
        }
        result[nodeName].push(childDict);
      } else {
        result[nodeName] = childDict;
      }
    }
  
    // Handle text content of the current element
    if (element.textContent) {
      const textContent = element.textContent.trim();
      if (textContent && !Object.keys(result).length) {
        return textContent;
      }
    }
  
    // Return the constructed dictionary
    return result;
  }

function pruneEmpty(data: any): any {
  if (Array.isArray(data)) {
    return data.map(pruneEmpty).filter(item => item);
  } else if (typeof data === 'object') {
    const result: any = {};
    Object.entries(data).forEach(([key, value]) => {
      const pruned = pruneEmpty(value);
      if (pruned) {
        result[key] = pruned;
      }
    });
    return Object.keys(result).length ? result : null;
  }
  return data;
}
