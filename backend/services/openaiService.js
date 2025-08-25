const OpenAI = require('openai');

class OpenAIService {
  constructor() {
    this.openai = process.env.OPENAI_API_KEY 
      ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
      : null;
  }

  async generateBlogPost(topic) {
    if (!this.openai) {
      // Mock response for testing without API key
      return this.generateMockBlog(topic);
    }

    try {
      const prompt = `Write a comprehensive, engaging blog post about "${topic}". 
      
Requirements:
- Minimum 800 words
- Include an engaging title
- Use proper headings (H2, H3)
- Write in a professional, informative tone
- Include actionable insights
- Structure with introduction, main sections, and conclusion
- Format as markdown`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo", // Changed from gpt-4 to gpt-3.5-turbo
        messages: [
          {
            role: "system",
            content: "You are a professional blog writer who creates high-quality, engaging content."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7
      });

      const content = response.choices[0].message.content;
      const lines = content.split('\n').filter(line => line.trim());
      const title = lines[0]?.replace(/^#+\s*/, '') || `Understanding ${topic}`;

      return { title, content };
    } catch (error) {
      console.error('OpenAI API Error:', error);
      // Fallback to mock if OpenAI fails
      return this.generateMockBlog(topic);
    }
  }

  generateMockBlog(topic) {
    const mockContent = `# Understanding ${topic}

## Introduction

${topic} is a fascinating and rapidly evolving field that has captured the attention of researchers, businesses, and the general public alike. In this comprehensive guide, we'll explore the key aspects, current developments, and future implications of ${topic}.

## What is ${topic}?

${topic} represents a significant advancement in modern technology and thinking. It encompasses various methodologies, tools, and approaches that are reshaping how we understand and interact with complex systems.

## Key Benefits

Understanding ${topic} offers several advantages:

- **Enhanced Efficiency**: ${topic} streamlines processes and reduces complexity
- **Innovation Driver**: It opens new possibilities for creative solutions
- **Future-Ready**: Prepares organizations and individuals for upcoming challenges
- **Competitive Advantage**: Early adoption provides strategic benefits

## Current Applications

Today, ${topic} is being implemented across various sectors:

### Technology Sector
Companies are leveraging ${topic} to improve their products and services, creating more intuitive and powerful solutions for end-users.

### Healthcare Industry
Medical professionals utilize ${topic} to enhance patient care, improve diagnostic accuracy, and streamline treatment protocols.

### Education Field
Educational institutions incorporate ${topic} to create more engaging learning experiences and personalized educational pathways.

## Implementation Strategies

When considering ${topic} implementation, organizations should:

1. **Assess Current Capabilities**: Evaluate existing infrastructure and resources
2. **Define Clear Objectives**: Establish measurable goals and success metrics
3. **Develop Phased Approach**: Implement gradually to minimize disruption
4. **Invest in Training**: Ensure team members have necessary skills and knowledge
5. **Monitor and Adjust**: Continuously evaluate progress and make improvements

## Challenges and Considerations

While ${topic} offers tremendous potential, there are important considerations:

- **Technical Complexity**: Requires specialized knowledge and expertise
- **Resource Requirements**: May demand significant time and financial investment
- **Change Management**: Organizations must adapt to new processes and methodologies
- **Ethical Implications**: Consider the broader impact on society and stakeholders

## Future Outlook

The future of ${topic} looks incredibly promising. As technology continues to advance and our understanding deepens, we can expect to see:

- More sophisticated applications and use cases
- Increased accessibility and user-friendly implementations
- Better integration with existing systems and processes
- Enhanced collaboration between different sectors and disciplines

## Best Practices

To maximize the benefits of ${topic}, consider these best practices:

- Stay informed about latest developments and trends
- Collaborate with experts and industry leaders
- Maintain a focus on user needs and experiences
- Regularly evaluate and update your approach
- Foster a culture of continuous learning and improvement

## Conclusion

${topic} represents a transformative force that will continue to shape our world in profound ways. By understanding its principles, applications, and implications, we can better prepare for the future and harness its potential for positive change.

Whether you're a business leader, researcher, educator, or simply someone interested in emerging trends, ${topic} offers valuable insights and opportunities for growth and innovation.

As we move forward, it's essential to approach ${topic} with both enthusiasm and responsibility, ensuring that its development and implementation benefit society as a whole.`;

    return {
      title: `Understanding ${topic}: A Comprehensive Guide`,
      content: mockContent
    };
  }
}

module.exports = new OpenAIService();
 