// Backend service to aggregate feeds from Twitter, Reddit, and LinkedIn
const axios = require("axios");
const Content = require("../models/Content");

// Helper function to deduplicate content based on originalId
const isDuplicate = async (originalId) => {
  const existing = await Content.findOne({ originalId });
  return !!existing;
};

// Twitter API integration
exports.fetchTwitterContent = async () => {
  try {
    // This would be replaced with actual Twitter API calls
    // For demonstration purposes, we're simulating the API response
    console.log("Fetching content from Twitter API");

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock data that would come from Twitter API
    const mockTwitterData = [
      {
        id: "tw1234567890",
        text: "Learn how to build scalable Node.js applications #javascript #webdev",
        user: { name: "JavaScript Daily", screen_name: "JavaScriptDaily" },
        entities: {
          media: [{ media_url_https: "https://example.com/image1.jpg" }],
        },
        created_at: new Date().toISOString(),
      },
      {
        id: "tw0987654321",
        text: "New React 18 features explained with practical examples #reactjs",
        user: { name: "React Community", screen_name: "ReactJS_News" },
        entities: { media: [] },
        created_at: new Date().toISOString(),
      },
    ];

    // Transform and save Twitter content
    const savedContent = [];
    for (const tweet of mockTwitterData) {
      // Skip if we already have this content
      if (await isDuplicate(tweet.id)) continue;

      const content = new Content({
        title: tweet.text.substring(0, 100),
        description: tweet.text,
        source: "twitter",
        originalId: tweet.id,
        url: `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id}`,
        imageUrl:
          tweet.entities.media && tweet.entities.media.length > 0
            ? tweet.entities.media[0].media_url_https
            : null,
        author: tweet.user.name,
        createdAt: new Date(tweet.created_at),
      });

      await content.save();
      savedContent.push(content);
    }

    console.log(`Saved ${savedContent.length} items from Twitter`);
    return savedContent;
  } catch (error) {
    console.error("Error fetching Twitter content:", error.message);
    return [];
  }
};

// Reddit API integration
exports.fetchRedditContent = async () => {
  try {
    console.log("Fetching content from Reddit API");

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock data that would come from Reddit API
    const mockRedditData = [
      {
        id: "rd1234567890",
        title: "How I built a full-stack app with MongoDB and Express",
        selftext:
          "Here is my journey building a full-stack application using MongoDB, Express, React, and Node.js...",
        author: "webdev_enthusiast",
        permalink:
          "/r/webdev/comments/1234567890/how_i_built_a_fullstack_app_with_mongodb_and/",
        url: "https://reddit.com/r/webdev/comments/1234567890/how_i_built_a_fullstack_app_with_mongodb_and/",
        preview: {
          images: [
            { source: { url: "https://example.com/reddit_image1.jpg" } },
          ],
        },
        created_utc: Math.floor(Date.now() / 1000),
      },
      {
        id: "rd0987654321",
        title: "What are your favorite resources for learning TypeScript?",
        selftext:
          "I'm looking for the best resources to learn TypeScript in depth...",
        author: "typescript_beginner",
        permalink:
          "/r/typescript/comments/0987654321/what_are_your_favorite_resources_for_learning/",
        url: "https://reddit.com/r/typescript/comments/0987654321/what_are_your_favorite_resources_for_learning/",
        preview: { images: [] },
        created_utc: Math.floor(Date.now() / 1000) - 3600,
      },
    ];

    // Transform and save Reddit content
    const savedContent = [];
    for (const post of mockRedditData) {
      // Skip if we already have this content
      if (await isDuplicate(post.id)) continue;

      const content = new Content({
        title: post.title,
        description: post.selftext || post.title,
        source: "reddit",
        originalId: post.id,
        url: `https://reddit.com${post.permalink}`,
        imageUrl:
          post.preview && post.preview.images && post.preview.images.length > 0
            ? post.preview.images[0].source.url
            : null,
        author: post.author,
        createdAt: new Date(post.created_utc * 1000),
      });

      await content.save();
      savedContent.push(content);
    }

    console.log(`Saved ${savedContent.length} items from Reddit`);
    return savedContent;
  } catch (error) {
    console.error("Error fetching Reddit content:", error.message);
    return [];
  }
};

// LinkedIn API integration
exports.fetchLinkedInContent = async () => {
  try {
    console.log("Fetching content from LinkedIn API");

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock data that would come from LinkedIn API
    const mockLinkedInData = [
      {
        id: "li1234567890",
        title: "Building a Career in Software Development",
        description:
          "Tips and strategies for advancing your career in software development...",
        author: "Jane Smith, Senior Software Engineer at Tech Company",
        permalinkUrl:
          "https://www.linkedin.com/posts/janesmith_software-career-development-activity-1234567890",
        thumbnailUrl: "https://example.com/linkedin_image1.jpg",
        created: new Date().toISOString(),
      },
      {
        id: "li0987654321",
        title: "The Future of Web Development: Trends to Watch",
        description:
          "Exploring upcoming trends in web development and how they will shape the industry...",
        author: "John Doe, Web Development Lead",
        permalinkUrl:
          "https://www.linkedin.com/posts/johndoe_webdev-future-trends-activity-0987654321",
        thumbnailUrl: null,
        created: new Date(Date.now() - 7200000).toISOString(),
      },
    ];

    // Transform and save LinkedIn content
    const savedContent = [];
    for (const post of mockLinkedInData) {
      // Skip if we already have this content
      if (await isDuplicate(post.id)) continue;

      const content = new Content({
        title: post.title,
        description: post.description,
        source: "linkedin",
        originalId: post.id,
        url: post.permalinkUrl,
        imageUrl: post.thumbnailUrl,
        author: post.author,
        createdAt: new Date(post.created),
      });

      await content.save();
      savedContent.push(content);
    }

    console.log(`Saved ${savedContent.length} items from LinkedIn`);
    return savedContent;
  } catch (error) {
    console.error("Error fetching LinkedIn content:", error.message);
    return [];
  }
};

// Main function to aggregate feed from all sources
exports.aggregateAllFeeds = async () => {
  try {
    console.log("Starting feed aggregation from all sources");

    // Fetch content from all sources in parallel
    const [twitterContent, redditContent, linkedinContent] = await Promise.all([
      this.fetchTwitterContent(),
      this.fetchRedditContent(),
      this.fetchLinkedInContent(),
    ]);

    const totalSaved =
      twitterContent.length + redditContent.length + linkedinContent.length;
    console.log(
      `Successfully aggregated feed content: ${totalSaved} new items saved`
    );

    return {
      success: true,
      count: totalSaved,
      sources: {
        twitter: twitterContent.length,
        reddit: redditContent.length,
        linkedin: linkedinContent.length,
      },
    };
  } catch (error) {
    console.error("Error aggregating feeds:", error.message);
    return {
      success: false,
      error: error.message,
    };
  }
};
