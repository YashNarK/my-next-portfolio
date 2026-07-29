import { IChallenge } from "./data.type";

/**
 * Starter set of engineering challenges.
 *
 * Seeded into Firestore from the admin Challenges page. Seeding matches on
 * `title`, so re-running it adds only what is missing and never duplicates
 * or overwrites edits made through the UI.
 *
 * `createdAt` / `updatedAt` are stamped at write time, not here.
 */
export type ChallengeSeed = Omit<IChallenge, "createdAt" | "updatedAt">;

export const CHALLENGE_SEEDS: ChallengeSeed[] = [
  // ==========================================================
  // LangGraph
  // ==========================================================
  {
    category: "LangGraph",
    subCategory: "Framework Semantics",
    title:
      "Streaming turns AIMessage into AIMessageChunk and silently ends the ReAct loop",
    order: 1,
    description: `The agent answered with only its preamble — "Let me check the market indicators..." — and stopped. No exception, no failed run. The graph reported success and returned the wrong message.

The chat model was configured with streaming: true so an SSE route could stream tokens. With streaming on, invoke() aggregates the stream and returns an AIMessageChunk — and AIMessageChunk does NOT extend AIMessage. Every "instanceof AIMessage" check in the routing logic therefore returned false for a perfectly normal assistant turn, so the conditional edge routed to END while a tool call was still pending.

Why it was hard to see: this was a Python to TypeScript port, and the bug is invisible in a line-by-line comparison. Python's ainvoke returns an AIMessage regardless of streaming, so the original code was correct and the faithful translation was not. Semantic equivalence is not line equivalence.

The fix is to compare the message TYPE rather than the class, which is stable across both shapes.

Related trap in the same family: in a ReAct loop the last message is not the answer. Intermediate hops emit assistant messages with empty or preamble content, so you must walk backwards for the last non-empty assistant message, and collect tool calls across all hops rather than only the final one.`,
    codeExample: `// WRONG — false for a streamed turn, silently ends the loop
if (last instanceof AIMessage && last.tool_calls?.length) return "tools";

// RIGHT — stable whether the message arrived as AIMessage or AIMessageChunk
export function isAiMessage(message: BaseMessage): boolean {
  return message.getType() === "ai";
}

export function shouldContinue(state: AgentStateType): "tools" | "end" {
  const messages = state.messages;
  if (messages.length === 0) return "end";
  const last = messages[messages.length - 1];
  if (isAiMessage(last) && toolCallsOf(last).length > 0) return "tools";
  return "end";
}`,
    referenceUrls: [
      "https://langchain-ai.github.io/langgraphjs/",
      "https://js.langchain.com/docs/concepts/messages/",
    ],
  },
  {
    category: "LangGraph",
    subCategory: "State Management",
    title: "A per-turn tool budget that leaked across turns via the checkpointer",
    order: 2,
    description: `Reported symptom: the first question — broad, multi-crop — was answered well, with full reasoning and eight tool calls. The very next question in the same conversation produced no response at all.

We cap tool calls per turn so a broad question cannot run away. The counter summed tool calls across the entire message list. But with a checkpointer keyed by thread_id, graph state ACCUMULATES across turns — so turn 2 was still counting turn 1's calls. It entered the LLM node already over budget, with tools unbound, and was told it had spent its budget before it had done anything. It then had to answer a five-year price question with no way to fetch a single price.

The function's own docstring said "this turn". The code counted the whole thread. It was also inherited from the original Python service, where the same bug is still live — it stays hidden for exactly as long as first questions are narrow enough not to hit the cap.

Fix: count from the last human message.

The transferable lesson is that persistence changes the meaning of code that reads state. Anything scoped "per turn" needs an explicit boundary once a checkpointer is involved.

Verified before and after by replaying the reported sequence on one thread:
  before — turn 2: 0 tool calls, one LLM hop, recycled turn 1's data
  after  — turn 2: 8 tool calls of its own, and a complete analysis`,
    codeExample: `// WRONG — sums the whole thread; a checkpointer makes this grow forever
function countToolCalls(messages: BaseMessage[]): number {
  return messages.reduce(
    (total, m) => (isAiMessage(m) ? total + toolCallsOf(m).length : total),
    0,
  );
}

// RIGHT — the budget is per TURN, so count from the last human message
function countToolCalls(messages: BaseMessage[]): number {
  let start = 0;
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    if (messages[i].getType() === "human") { start = i; break; }
  }
  let total = 0;
  for (let i = start; i < messages.length; i += 1) {
    if (isAiMessage(messages[i])) total += toolCallsOf(messages[i]).length;
  }
  return total;
}`,
    referenceUrls: [
      "https://langchain-ai.github.io/langgraphjs/concepts/persistence/",
    ],
  },
  {
    category: "LangGraph",
    subCategory: "Streaming / AG-UI",
    title: "A turn that produces no text renders as silence, not as an error",
    order: 3,
    description: `When bridging LangGraph's streamEvents to the AG-UI protocol, you must skip chunks with empty content — that is how tool-call argument deltas arrive, and emitting a text message for them opens a protocol bracket that never carries anything and never legitimately closes, which hangs the client.

But that necessary skip has a consequence: a turn where the model returns no text at all emits ZERO text events and finishes with RUN_FINISHED and no messages. To the user that is the assistant ignoring them, with no error anywhere to explain it — the run "succeeded".

This is the second half of why the budget bug above appeared as total silence rather than merely a worse answer.

Fix: track the streamed segments and, if a run produced none, emit a fallback message explicitly. A run must never end in silence, whatever caused the emptiness.

The general rule: in a streaming protocol, "no events" and "success" are indistinguishable to a client unless you make them distinguishable.`,
    codeExample: `// tool-call argument deltas arrive as chunks with EMPTY content —
// emitting a text message for them opens a bracket that never carries anything
if (text === "") break;

// ...and therefore a run can legitimately produce no text at all.
// Never let that surface as silence:
let answer = [...segments].reverse().find((s) => s.trim() !== "") ?? "";

if (answer === "" && !signal.aborted) {
  answer = BUDGET_FALLBACK;
  const messageId = \`\${runId}-msg-fallback\`;
  emit({ type: EventType.TEXT_MESSAGE_START, messageId, role: "assistant" });
  emit({ type: EventType.TEXT_MESSAGE_CONTENT, messageId, delta: answer });
  emit({ type: EventType.TEXT_MESSAGE_END, messageId });
}`,
    referenceUrls: ["https://github.com/ag-ui-protocol/ag-ui"],
  },
  {
    category: "LangGraph",
    subCategory: "Developer Experience",
    title: "The compiled graph cached on globalThis survives hot reload",
    order: 4,
    description: `The most embarrassing one, and the most useful.

I ran a series of prompt-placement experiments, tabulated the results, and drew conclusions from them. Then I noticed the model quoting a string verbatim that I had ALREADY DELETED from the source.

The compiled graph was memoised on globalThis so it would be built once and reused. That cache deliberately outlives module reloads, which is correct in production and actively harmful in development: Next hot-reloads the module on every edit, but the graph parked on globalThis survives, so the process keeps serving the PREVIOUSLY compiled nodes, tools and prompts.

Edits to the agent therefore appear to do nothing — and worse, appear to do something inconsistent, because the stale graph answers while the source says otherwise.

Every measurement taken before that discovery was measuring old code. I threw the results away and redid them with a cold start per variant.

The lesson worth carrying: when the system under test caches itself, your experiment can be measuring nothing while looking perfectly self-consistent. Verify that the code you think you are testing is the code that is running.

Fix: use a module-level binding in development, which HMR resets, and keep the global cache for production.`,
    codeExample: `// Module-scoped in dev (HMR resets it); global in prod (survives reloads).
let devGraph: Promise<CompiledAgentGraph> | undefined;
const isDev = process.env.NODE_ENV !== "production";

export function getAgentGraph(): Promise<CompiledAgentGraph> {
  const cached = isDev ? devGraph : globalForGraph.__agentGraph;
  if (cached) return cached;

  const building = loadAppConfig()
    .then(buildAgentGraph)
    .catch((error: unknown) => {
      if (isDev) devGraph = undefined;
      else globalForGraph.__agentGraph = undefined;
      throw error;
    });

  if (isDev) devGraph = building;
  else globalForGraph.__agentGraph = building;
  return building;
}`,
    referenceUrls: [],
  },
  {
    category: "LangGraph",
    subCategory: "Generative UI",
    title: "Tools return prose for the model, but the UI needs numbers",
    order: 5,
    description: `The agent's tools return PROSE on purpose — the model reads those strings directly, and the wording was production-proven. But prose is the wrong shape for a chart, and the chat UI needed to render forecasts inline.

Worse, the constraint is baked into the protocol: in AG-UI, TOOL_CALL_RESULT.content is typed as a string, and CopilotKit's tool-call renderer receives result: string. So the structured payload cannot ride along with the tool result at all.

The tempting fix is to regex the numbers back out of "Predicted price : $253.26/tonne". That works right up until someone reformats a message, and then it fails SILENTLY, producing a plausible-looking chart built from whatever the pattern happened to match.

The correct mechanism is LangChain's content_and_artifact response format. A tool returns [content, artifact]: the model still receives ONLY content, byte for byte what it received before, and the artifact rides along on the ToolMessage where the bridge can read it at on_tool_end. The bridge then puts it in agent state keyed by tool-call id, and the renderer looks itself up by the one handle it is given.

Net effect: agent behaviour is bit-for-bit unchanged while the UI gains a typed payload.`,
    codeExample: `// The model sees ONLY the prose; the artifact rides on the ToolMessage.
const predictCropPrice = tool(
  async ({ crop_code, region_code, target_date }) => {
    // ...
    const prose =
      \`Price prediction for \${crop.name} on \${target_date}:\\n\` +
      \`  Predicted price : $\${money(predictedPrice)}/tonne\`;

    const artifact: ForecastArtifact = {
      kind: "forecast",
      crop_code, region_code, target_date,
      predicted_price: predictedPrice,
      // null, NOT collapsed onto the point estimate — a zero-width band
      // would render as perfect certainty when none was reported
      confidence_low: confidenceLow ?? null,
      confidence_high: confidenceHigh ?? null,
    };

    return [prose, artifact];
  },
  {
    name: "predict_crop_price",
    responseFormat: "content_and_artifact",
    schema: z.object({ /* ... */ }),
  },
);`,
    referenceUrls: [
      "https://js.langchain.com/docs/how_to/tool_artifacts/",
      "https://github.com/ag-ui-protocol/ag-ui",
    ],
  },
  {
    category: "LangGraph",
    subCategory: "Prompt Engineering",
    title:
      "Whether a guardrail is obeyed depended on message placement, not wording",
    order: 6,
    description: `When the tool budget is spent, the final LLM hop runs with NO TOOLS BOUND. That is the actual guardrail — the loop terminates regardless of what the model does. A notice then tells the model to finalise and be explicit about what it skipped.

Getting that notice obeyed took four measured attempts, each on a cold server:

1. Trailing SYSTEM message — the model CONTINUED it. Every budget-exhausted answer opened with a stray fragment of instruction prose.
2. Merged into the leading system prompt — too distant to heed after eight tool results. The model tried to keep calling tools and emitted raw <function_calls> XML as prose.
3. Trailing USER message, softened to "that's enough research" — too weak. XML leak again, 185-character answer.
4. Trailing USER message, operative wording kept, quotable "SYSTEM NOTICE:" label dropped — clean.

Both working variants kept the explicit "none are available on this step"; both failures had softened or distanced it. That clause is load-bearing.

Two things generalise. First, a trailing system message is addressed to nobody, so the model completes it; a user turn is unambiguously "respond to this now". Second, and more important in an interview: separate the HARD constraint from the SOFT guidance. Tools were unbound either way, so correctness never depended on the prompt — the prompt only shaped how the model finalised. If your guardrail lives only in a prompt, you do not have a guardrail.`,
    codeExample: `// The guardrail is baseLlm having NO tools bound — the loop cannot continue.
// The notice only shapes HOW the model finalises, and is delivered as a
// trailing HUMAN message: recent enough to be heeded, and unambiguously
// addressed to the model. It is ephemeral — only the response enters state.
if (countToolCalls(messages) >= MAX_AGENT_TOOL_CALLS) {
  response = (await baseLlm.invoke([
    ...messages,
    new HumanMessage(TOOL_BUDGET_NOTICE),
  ])) as AIMessage;
} else {
  response = (await llmWithTools.invoke(messages)) as AIMessage;
}`,
    referenceUrls: [],
  },

  // ==========================================================
  // LLM
  // ==========================================================
  {
    category: "LLM",
    subCategory: "Tool Calling",
    title: "Handling malformed tool call invocations from budget LLMs",
    order: 1,
    description: `Working with an Azure AI Foundry hosted, OpenAI-compatible model (DeepSeek v3.2), it would almost always emit improperly formatted tool call invocations — leaking chain-of-thought or commentary alongside the invocation object.

Because of that, tool node parsing broke and threw. Since it was the LLM, we never suspected it as the cause.

What made it genuinely hard to diagnose:

- The failure was NON-DETERMINISTIC. It worked sometimes, which made it look like a parsing edge case rather than a model behaviour issue.
- The OpenAI-compatible interface gave a false sense of contract guarantee. "OpenAI-compatible" describes the request/response shape, not the model's discipline in filling it.
- Errors surfaced at the tool node parser, not at the LLM call — so the blast radius pointed away from the real cause.

Eventually we found it sometimes returns a tool call invocation object AND some remarks about it, which breaks JSON parsing.

The fix is a guardrail that parses any unknown input to Record<string, unknown> | null. If null, we loop back to the LLM stating what it missed and request a proper invocation.

Logic: if raw is null return {}; if it is already an object return it; if it is not a string return null; otherwise trim and try JSON.parse; and if that fails but it starts with {, scan while tracking brace depth and ignoring braces inside strings and escaped quotes until depth returns to 0, then parse that substring and return the object, else return null.

This creates a self-correcting feedback loop inside the agent graph rather than a hard crash.

Note that Python has json.JSONDecoder.raw_decode for exactly this; JavaScript has no equivalent, so the scanner is hand-written.

Takeaway: this may not be a problem with a higher-capacity LLM, but when exploring budget options you may have to guardrail every tool call.`,
    codeExample: `/**
 * Recovers a tool-call arguments object from a malformed JSON string.
 * Models emit args like {"crop_code":"MAIZE"}"" — valid JSON plus trailing
 * junk. A strict JSON.parse throws, so LangChain files the call under
 * invalid_tool_calls and leaves .tool_calls EMPTY, which stalls the loop.
 */
export function salvageToolArgs(raw: unknown): Record<string, unknown> | null {
  if (raw === null || raw === undefined) return {};
  if (typeof raw === "object") return raw as Record<string, unknown>;
  if (typeof raw !== "string") return null;

  const text = raw.trim();
  if (text === "") return {};

  try {
    const parsed: unknown = JSON.parse(text);
    return typeof parsed === "object" && parsed !== null
      ? (parsed as Record<string, unknown>)
      : null;
  } catch {
    // fall through to the prefix scan
  }

  if (!text.startsWith("{")) return null;

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (escaped) { escaped = false; continue; }
    if (char === "\\\\") { escaped = true; continue; }
    if (char === '"') { inString = !inString; continue; }
    if (inString) continue;

    if (char === "{") depth += 1;
    if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        try {
          const parsed: unknown = JSON.parse(text.slice(0, i + 1));
          return typeof parsed === "object" && parsed !== null
            ? (parsed as Record<string, unknown>)
            : null;
        } catch {
          return null;
        }
      }
    }
  }
  return null;
}`,
    referenceUrls: [
      "https://learn.microsoft.com/en-us/azure/ai-foundry/",
      "https://js.langchain.com/docs/concepts/tool_calling/",
    ],
  },

  // ==========================================================
  // React
  // ==========================================================
  {
    category: "React",
    subCategory: "Architecture",
    title:
      "Azure DevOps Extension Model: micro frontends, but with none of the escape hatches",
    order: 1,
    description: `Contributed UI extensions in Azure DevOps look like a micro frontend architecture, and reasoning about them as one gets you most of the way — then quietly betrays you.

WHAT IS GENUINELY THE SAME
- A shell application (Azure DevOps) that you do not own or control.
- Independently built, independently deployed UI units (your React extension) that plug into that shell.
- Each extension has its own build pipeline, own dependencies, own release cycle, fully decoupled from the host.
- The shell composes multiple such units at runtime, like a micro frontend orchestrator.
- There is a clear contract between shell and extension (contribution points + SDK), like a micro frontend integration contract.

WHERE IT DIVERGES
- Isolation: MFEs use module federation, web components or custom elements, and often share the DOM. Azure DevOps extensions are HARD iframe sandboxes — no shared window object, no global events.
- Communication: MFEs talk via shared state, DOM custom events, an event bus, or module imports through webpack module federation. Azure DevOps extensions communicate strictly via postMessage through the Extension SDK, serialised across the iframe boundary.
- Ownership: the shell is Azure's, not yours.
- Routing: MFEs allow dynamic routing per micro app. Here you post into a fixed contribution point.
- Delivery: a fixed .vsix package and Azure cloud resource lock, versus full control over URL and delivery in an MFE.
- Dependencies: MFEs can share dependencies across teams through the shell boundary. The iframe means bring-your-own-dependencies only — no sharing a React version.

The research constraint made this harder: the client did not want an LLM used on the codebase, because the connected data was sensitive. So we went through the Azure DevOps extension docs manually to find the exact mechanism.

The key discovery was the HostMessageBus service, which exposes subscribe() to listen for messages and publish() to broadcast to other extensions or the host.`,
    codeExample: `import * as SDK from "azure-devops-extension-sdk";
import { CommonServiceIds, IHostMessageBus } from "azure-devops-extension-api";

await SDK.init();
await SDK.ready();

// The one mechanism that crosses the iframe boundary.
const bus = await SDK.getService<IHostMessageBus>(
  CommonServiceIds.HostMessageBus,
);

// listen for messages from the host or other extensions
bus.subscribe("my-channel", (message: unknown) => {
  // everything here is SERIALISED — no shared references, no DOM access,
  // no functions. Treat it exactly like a network payload.
});

// broadcast outward
bus.publish("my-channel", { type: "REFRESH", payload: { id: 42 } });`,
    referenceUrls: [
      "https://learn.microsoft.com/en-us/azure/devops/extend/overview",
      "https://learn.microsoft.com/en-us/azure/devops/extend/develop/contributions-overview",
    ],
  },

  // ==========================================================
  // Backend System Design
  // ==========================================================
  {
    category: "Backend System Design",
    subCategory: "Event-Driven Architecture",
    title: "Cascading failure: moving the circuit breaker to the channel",
    order: 1,
    description: `Working across four systems in an event-driven architecture, one failure point consistently led to complete channel failure through a pile-up of failed events.

Even with exponential backoff and a dead letter queue in place, we hit severe backpressure — essentially a full channel meltdown, because the system kept expecting the failing node to respond.

The root issue: exponential backoff and DLQs help with INDIVIDUAL EVENT resilience, but they do not account for SYSTEMIC NODE failure. They slow the pile-up down; they do not stop it. Every retry still assumes the node will eventually answer this particular event, when the real situation is that the node is down for all events.

So we implemented the circuit breaker pattern, with the state living on the CHANNEL rather than on the event. Three states:

- CLOSED — normal, functional. The default.
- OPEN — entered immediately after 3 retry failures to the failing node. We may still receive events from the publisher, but we no longer expect the failing node's subscriber to respond with its own response event, which is what was failing and causing the pile-up.
- HALF-OPEN — after a period longer than the exponential retry window, we test the waters by sending a test event to the failing node. On success we close the channel; otherwise we return to open and retry later.

The important design shift is whose state it is. Per-event retry state cannot express "this dependency is down"; only channel-level state can, and that is what stops the pile-up instead of merely pacing it.`,
    codeExample: `// State belongs to the CHANNEL, not to the event.
type BreakerState = "CLOSED" | "OPEN" | "HALF_OPEN";

const FAILURE_THRESHOLD = 3;
// deliberately longer than the exponential backoff window, so probing
// never races the in-flight retries it is meant to replace
const PROBE_AFTER_MS = 60_000;

class ChannelBreaker {
  private state: BreakerState = "CLOSED";
  private failures = 0;
  private openedAt = 0;

  shouldExpectResponse(now: number): boolean {
    if (this.state === "CLOSED") return true;
    if (this.state === "OPEN" && now - this.openedAt >= PROBE_AFTER_MS) {
      this.state = "HALF_OPEN";   // send exactly one probe event
      return true;
    }
    return this.state === "HALF_OPEN";
  }

  onSuccess() { this.state = "CLOSED"; this.failures = 0; }

  onFailure(now: number) {
    this.failures += 1;
    if (this.state === "HALF_OPEN" || this.failures >= FAILURE_THRESHOLD) {
      this.state = "OPEN";
      this.openedAt = now;
    }
  }
}`,
    referenceUrls: [
      "https://martinfowler.com/bliki/CircuitBreaker.html",
      "https://learn.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker",
    ],
  },
];
