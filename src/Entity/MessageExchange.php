<?php

namespace App\Entity;

use App\Repository\MessageExchangeRepository;

use Doctrine\Common\Collections\ArrayCollection; 
use Doctrine\Common\Collections\Collection;

use Doctrine\ORM\Mapping as ORM; 
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass=MessageExchangeRepository::class)
 * @ORM\HasLifecycleCallbacks
 */

class MessageExchange {
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue() /**
     * @ORM\Column(type="integer") 
     */
    private $id;


    /**
     * @ORM\Column(type="text")
     */

    private $content;

    /**
     * @var datetime $created
     *
     * @ORM\Column(type="datetime")
     */
    protected $created;

    /**
     * @ORM\ManyToOne(targetEntity=ConversationExchange::class, inversedBy="messagesExchange")
     * @ORM\JoinColumn(nullable=true)
     */
    private $conversationExchange;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="messageExchanges")
     */
    private $user;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(string $content): self
    {
        $this->content = $content;

        return $this;
    }

    public function getCreated(): \DateTime
    {
        return $this->created;
    }

    public function getConversationExchange(): ?ConversationExchange
    {
        return $this->conversationExchange;
    }

    public function setConversationExchange(?ConversationExchange $conversationExchange): self
    {
        $this->conversationExchange = $conversationExchange;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }

    /**
     * Gets triggered only on insert
     * @ORM\PrePersist
     */
    public function onPrePersist()
    {
        $this->created = new \DateTime("now");
    }

}
