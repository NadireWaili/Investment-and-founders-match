// ── Slack Integration Service ──────────────────────────────────────────────────
// Sends rich interactive deal alerts directly to Slack channels via Incoming Webhooks.

const SLACK_STORAGE_KEY = 'talentRadar_slackConfig';

export function getSlackConfig() {
  try {
    const data = localStorage.getItem(SLACK_STORAGE_KEY);
    return data ? JSON.parse(data) : { webhookUrl: '', channelName: '#deal-flow', autoNotifyHighMatch: true };
  } catch {
    return { webhookUrl: '', channelName: '#deal-flow', autoNotifyHighMatch: true };
  }
}

export function saveSlackConfig(config) {
  localStorage.setItem(SLACK_STORAGE_KEY, JSON.stringify(config));
}

export async function sendFounderToSlack({ founder, scoreData, investorProfile, rank }) {
  const config = getSlackConfig();
  const fitScore = scoreData?.fitScore || 85;
  const rankLabel = rank ? `#${rank} Ranked Match` : 'Top Match';

  // Build Rich Slack Block Kit payload
  const payload = {
    channel: config.channelName || '#deal-flow',
    username: 'Talent Radar AI',
    icon_emoji: ':dart:',
    attachments: [
      {
        color: fitScore >= 85 ? '#10b981' : fitScore >= 70 ? '#3b82f6' : '#f59e0b',
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: `🎯 [${rankLabel}] ${founder.name} — ${fitScore}% Match`,
              emoji: true
            }
          },
          {
            type: 'section',
            fields: [
              {
                type: 'mrkdwn',
                text: `*Venture / Company:*\n${founder.currentCompany} (${founder.stage})`
              },
              {
                type: 'mrkdwn',
                text: `*Location & Region:*\n📍 ${founder.location} (${founder.region})`
              },
              {
                type: 'mrkdwn',
                text: `*Industry:*\n🏷️ ${founder.industry}`
              },
              {
                type: 'mrkdwn',
                text: `*Pedigree / Past:*\n🎓 ${founder.previousEmployers?.join(', ') || 'N/A'}`
              }
            ]
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*AI Investment Memo:*\n${scoreData?.summary || founder.bio}`
            }
          },
          ...(scoreData?.strongSignals?.length ? [{
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*⚡ Strong Match Signals:*\n${scoreData.strongSignals.map(s => `• ${s}`).join('\n')}`
            }
          }] : []),
          ...(scoreData?.outreachAngle ? [{
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*💬 Recommended Outreach Angle (for ${investorProfile?.name || 'Investor'}):*\n_${scoreData.outreachAngle}_`
            }
          }] : []),
          {
            type: 'actions',
            elements: [
              {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: 'View LinkedIn Profile ↗',
                  emoji: true
                },
                url: founder.linkedinUrl || 'https://linkedin.com',
                style: 'primary'
              }
            ]
          },
          {
            type: 'context',
            elements: [
              {
                type: 'mrkdwn',
                text: `Discovered via *Talent Radar* · Evaluated against: *${investorProfile?.fundName || 'VC Thesis'}*`
              }
            ]
          }
        ]
      }
    ]
  };

  // If a real webhook URL is provided, send via fetch (CORS mode 'no-cors' is standard for incoming webhooks)
  if (config.webhookUrl && config.webhookUrl.startsWith('https://hooks.slack.com/')) {
    try {
      await fetch(config.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        mode: 'no-cors'
      });
      return { success: true, mode: 'live', channel: config.channelName };
    } catch (err) {
      console.warn('[SlackService] Live webhook fetch error:', err);
    }
  }

  // Fallback / Simulated mode for demo
  await new Promise(resolve => setTimeout(resolve, 600));
  return { 
    success: true, 
    mode: 'simulated', 
    channel: config.channelName || '#deal-flow', 
    payload 
  };
}
