// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract KnowledgeBase {
    struct Article {
        string id;
        address author;
        string title;
        string content;
        string category;
        string tags;
        uint256 upvotes;
        bool isAnswer;
        bool isArchived;
    }

    // Mapping from article ID (symbol/string) to Article
    mapping(string => Article) public articles;
    // Array to keep track of all article IDs
    string[] public articleIds;

    event ArticleCreated(string id, address author, string title);
    event ArticleEdited(string id, address editor);
    event ArticleUpvoted(string id, address voter, uint256 newUpvotes);
    event ArticleMarkedAnswer(string id);
    event ArticleArchived(string id);

    function createArticle(
        string memory _id,
        string memory _title,
        string memory _content,
        string memory _category,
        string memory _tags
    ) public {
        require(articles[_id].author == address(0), "Article ID already exists");

        articles[_id] = Article({
            id: _id,
            author: msg.sender,
            title: _title,
            content: _content,
            category: _category,
            tags: _tags,
            upvotes: 0,
            isAnswer: false,
            isArchived: false
        });

        articleIds.push(_id);
        emit ArticleCreated(_id, msg.sender, _title);
    }

    function editArticle(string memory _id, string memory _newContent) public {
        require(articles[_id].author != address(0), "Article does not exist");
        require(!articles[_id].isArchived, "Article is archived");

        articles[_id].content = _newContent;
        emit ArticleEdited(_id, msg.sender);
    }

    function upvoteArticle(string memory _id) public {
        require(articles[_id].author != address(0), "Article does not exist");
        require(!articles[_id].isArchived, "Article is archived");

        articles[_id].upvotes += 1;
        emit ArticleUpvoted(_id, msg.sender, articles[_id].upvotes);
    }

    function markAnswer(string memory _id) public {
        require(articles[_id].author != address(0), "Article does not exist");
        require(articles[_id].author == msg.sender, "Only author can mark as answer");

        articles[_id].isAnswer = true;
        emit ArticleMarkedAnswer(_id);
    }

    function archiveArticle(string memory _id) public {
        require(articles[_id].author != address(0), "Article does not exist");
        require(articles[_id].author == msg.sender, "Only author can archive");

        articles[_id].isArchived = true;
        emit ArticleArchived(_id);
    }

    function getArticle(string memory _id) public view returns (Article memory) {
        require(articles[_id].author != address(0), "Article does not exist");
        return articles[_id];
    }

    function getArticleCount() public view returns (uint256) {
        return articleIds.length;
    }

    function listArticles() public view returns (Article[] memory) {
        Article[] memory allArticles = new Article[](articleIds.length);
        for (uint256 i = 0; i < articleIds.length; i++) {
            allArticles[i] = articles[articleIds[i]];
        }
        return allArticles;
    }
}
