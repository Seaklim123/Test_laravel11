<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use App\Models\Telegram;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class TelegramController extends Controller
{
    protected $telegramToken;

    public function __construct()
    {
        $this->telegramToken = env('TELEGRAM_TOKEN');
    }

    public function handleWebhook(Request $request)
    {
        try {
            Log::info('📩 Webhook request received:', $request->all());

            $message = $request->input('message');

            // If we have a message with text, process it as a command
            if ($message && isset($message['text'])) {
                Log::info('Processing command:', ['text' => $message['text']]);
                $this->handleCommands($message);

                return response()->json([
                    'status' => true,
                    'message' => '✅ Command processed successfully'
                ]);
            }

            return response()->json([
                'status' => true,
                'message' => '✅ Webhook received'
            ]);
        } catch (\Exception $e) {
            Log::error('❌ Webhook error: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    private function handleCommands($message)
    {
        try {
            $chatId = $message['chat']['id'];
            $text = $message['text'] ?? '';
            $reply = '';

            if ($text === '/start') {
                $reply = "🎉 សូមស្វាគមន៍មកកាន់ OrderItem Bot!\n\n";
                $reply .= "សូមវាយអរក្ស៖ /generate_key ដើម្បីបានលេខកូដយកទៅកំណត់ក្នុង System អ្នក";
            } elseif ($text === '/generate_key') {
                Log::info('Generating key for chat ID: ' . $chatId);

                $uniqueCode = $this->generateUniqueCode();

                $existingUser = Telegram::where('chatBotID', $chatId)->first();

                if ($existingUser) {
                    $reply = "⚠️ អ្នកមានលេខកូដរួចហើយ:\n";
                    
                } else {
                    $telegram = new Telegram();
                    $telegram->app_key = $uniqueCode;
                    $telegram->chatBotID = $chatId;
                    $telegram->save();

                    $reply = "🔑 នេះជាលេខកូដសំងាត់របស់អ្នក៖\n";
                    $reply .= "======||======||======\n";
                    $reply .= "{$uniqueCode}\n";
                    $reply .= "======||======||======";
                }
            }

            if ($reply) {
                Log::info('Sending reply: ' . $reply);
                $this->sendMessage($chatId, $reply);
            }
        } catch (\Exception $e) {
            Log::error('Command handling error: ' . $e->getMessage());
            $this->sendMessage($chatId, "❌ មានបញ្ហាក្នុងការបង្កើតលេខកូដ។ សូមព្យាយាមម្តងទៀត។");
        }
    }

    private function generateUniqueCode($length = 30)
    {
        return Str::random($length) . time();
    }

    private function sendMessage($chatId, $text)
    {
        try {
            Log::info('Sending message:', ['chat_id' => $chatId, 'text' => $text]);

            $response = Http::post("https://api.telegram.org/bot{$this->telegramToken}/sendMessage", [
                'chat_id' => $chatId,
                'text' => $text,
                'parse_mode' => 'HTML',
                'disable_web_page_preview' => true
            ]);

            $result = $response->json();
            Log::info('Telegram API Response:', $result);

            if (!$response->successful()) {
                throw new \Exception('Failed to send message: ' . ($result['description'] ?? 'Unknown error'));
            }

            return $result;
        } catch (\Exception $e) {
            Log::error('Error sending message: ' . $e->getMessage());
            throw $e;
        }
    }

    // This is the method you requested
    public function showVerifyForm()
    {
        return inertia('Telegram/VerifyKey');
    }

    // And the verify method to handle form submission
    public function verify(Request $request)
    {
        $request->validate([
            'key' => 'required|string'
        ]);

        $user = Auth::user();
        $telegram = Telegram::where('app_key', $request->key)->first();

        if ($telegram) {
            if ($telegram->user_id) {
                return back()->with('success', 'linked');
            }
            $telegram->user_id = $user->id;
            $telegram->save();
            return back()->with('success', 'user-updated');
        }

        return back()->with('success', 'invalid');
    }
}
