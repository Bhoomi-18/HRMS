import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { messages, context } = await request.json();
    const lastMessage = messages[messages.length - 1]?.content || "";

    // In a real app, this would pass the `context` string to the LLM system prompt.
    // For this mock, we will just echo back the context to prove awareness.
    
    let mockReply = `I am the AI HR Copilot. `;
    
    if (context.path.includes('leave')) {
      mockReply += `I see you are on the Leave Management page. Do you need help applying for time off? `;
    } else if (context.path.includes('payroll')) {
      mockReply += `I see you are viewing Payroll. Do you have questions about your deductions? `;
    } else if (context.path.includes('onboarding')) {
      mockReply += `I see you are in Onboarding! Welcome to the team! Need help with your tasks? `;
    } else {
      mockReply += `I notice you are a ${context.role} on the ${context.path || '/'} page. How can I assist you today? `;
    }

    mockReply += `\n\n(You asked: "${lastMessage}")`;

    return NextResponse.json({ reply: mockReply });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
