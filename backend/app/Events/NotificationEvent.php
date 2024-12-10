<?php
namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;

class NotificationEvent implements ShouldBroadcast
{
    use InteractsWithSockets, SerializesModels;

    public $message;
    public $product_id;
    public $timestamp;

    public function __construct($message, $product_id)
    {
        $this->message = $message;
        $this->product_id = $product_id;
        $this->timestamp = now()->toDateTimeString();
    }

    public function broadcastOn()
    {
        return new Channel('notifications');
    }
}
