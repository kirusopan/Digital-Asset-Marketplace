// Support Tickets - JavaScript

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        initTicketSelection();
        initScrollToBottom();
    });

    // Ticket Selection
    function initTicketSelection() {
        const ticketItems = document.querySelectorAll('.ticket-item');
        
        ticketItems.forEach(item => {
            item.addEventListener('click', function() {
                ticketItems.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                // Scroll conversation to bottom
                setTimeout(() => {
                    const conversation = document.querySelector('.ticket-conversation');
                    if (conversation) {
                        conversation.scrollTop = conversation.scrollHeight;
                    }
                }, 100);
            });
        });
    }

    // Auto scroll conversation to bottom
    function initScrollToBottom() {
        const conversation = document.querySelector('.ticket-conversation');
        if (conversation) {
            conversation.scrollTop = conversation.scrollHeight;
        }
    }

})();