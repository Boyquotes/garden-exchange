<?php

namespace App\Entity;

use App\Repository\ConversationExchangeRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=ConversationExchangeRepository::class)
 */
class ConversationExchange
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $title;

    /**
     * @ORM\Column(type="text")
     */
    private $content;

    /**
     * @ORM\OneToMany(targetEntity=MessageExchange::class, mappedBy="conversationExchange", orphanRemoval=true)
     */
    private $messagesExchange;

    /**
     * @ORM\ManyToMany(targetEntity=User::class, inversedBy="conversationExchanges")
     */
    private $users;

    public function __construct()
    {
        $this->messagesExchange = new ArrayCollection();
        $this->users = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;

        return $this;
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

    /**
     * @return Collection|MessageExchange[]
     */
    public function getMessageExchanges(): Collection
    {
        return $this->messagesExchange;
    }

    public function addMessageExchange(MessageExchange $messageExchange): self
    {
        if (!$this->messagesExchange->contains($messageExchange)) {
            $this->messagesExchange[] = $messageExchange;
            $messageExchange->setConversationExchange($this);
        }

        return $this;
    }

    public function removeMessageExchange(MessageExchange $messageExchange): self
    {
        if ($this->messagesExchange->contains($messageExchange)) {
            $this->messagesExchange->removeElement($messageExchange);
            // set the owning side to null (unless already changed)
            if ($messageExchange->getConversationExchange() === $this) {
                $messageExchange->setConversationExchange(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|User[]
     */
    public function getUsers(): Collection
    {
        return $this->users;
    }

    public function addUser(User $user): self
    {
        if (!$this->users->contains($user)) {
            $this->users[] = $user;
        }

        return $this;
    }

    public function removeUser(User $user): self
    {
        if ($this->users->contains($user)) {
            $this->users->removeElement($user);
        }

        return $this;
    }
}
