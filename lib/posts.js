import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark'
import html from 'remark-html'

const postsDirectory = path.join(process.cwd(), 'posts')

export function getSortedPostsData() {
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames.map(fileName => {
        // remove .md extension
        const id = fileName.replace(/\.md$/, '');
        // read markdown file as string
        const absolutePath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(absolutePath, 'utf-8');
        const matterResult = matter(fileContents)
        // attach id to file content
        return {
            id,
            ...matterResult.data
        }
    })

    // sort posts by date
    return allPostsData.sort((postA, postB) => {
        if (postA.date < postB.date) {
            return 1;
        } else if (postA.date > postB.date) {
            return -1;
        } else {
            return 0
        }
    })
}

export function getAllPostIds() {
    const fileNames = fs.readdirSync(postsDirectory);
    return fileNames.map(fileName => {
        return {
            params: {
                id: fileName.replace(/\.md$/, '')
            }
        }
    })
}

export async function getPostData(id) {
    const fullPath = path.join(postsDirectory, `${id}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf-8')
    const matterResult = matter(fileContents)
    // Use remark to convert markdown into HTML string
    const processedContent = await remark()
        .use(html)
        .process(matterResult.content)
    const contentHtml = processedContent.toString()
    // Combine the data with the id and contentHtml

    return {
        id,
        contentHtml,
        ...matterResult.data
    }
}